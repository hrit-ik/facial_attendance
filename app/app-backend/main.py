from FaceRec import faceRec
from flask import Flask,render_template, request, Response
# import pymongo
import numpy as np
import csv
import json
from flask_cors import CORS
import datetime
# import redis
from db_setup import db, redis_client
import time

# Defining flask app and setting cors
app=Flask(__name__)
CORS(app)
# setting numpy print options
np.set_printoptions(linewidth=np.inf)

# Function to get numpy array from string stored in DB
def getNumpyArray(arr_str):
    new_array = eval('np.array(' + arr_str + ')')
    return new_array

# Setting current date
now = datetime.datetime.now()
current_date = now.strftime("%d-%m-%Y")

# Function to get next day in unix time
def get_next_day_utime():
    unixtime = time.mktime((datetime.datetime.now().date() + datetime.timedelta(days=1)).timetuple())
    return unixtime

#Function to set attendance for a class for current date in redis cache
def setAttendance(classId):
    attendance = db.attendances.find_one({'classId': classId, 'date': current_date})
    if(attendance):
        for studentId in attendance['studentIds']:
            # redis_client.set(f"{classId}_{studentId}_{current_date}", 'marked', exat=int(get_next_day_utime()))
            redis_client.set(f"{classId}_{studentId}_{current_date}", 'marked')

#function to set face encoding data for students of the logged in class in faceRec object.
def setFaces(_class):
    attendance = db.attendances.find_one({'classId': _class['_id']})
    print('attendance:', attendance)
    current_class = _class
    students = list(db.students.find({'classIds': current_class['_id']}))
    names = [student['name'] for student in students]
    print(names)
    face_encodings = [student['faceEncoding'] for student in students]
    ids = [student['_id'] for student in students]

    setAttendance(current_class['_id'])
    # faceRec.set_timing(current_class['timing'])
    faceRec.set_timing(["15:00", "23:00"])
    faceRec.encode(dict(zip(ids, names)), face_encodings, _class['_id'])

@app.route('/login', methods=['POST'])
def checkCredentials():
    data = request.get_json()
    classCode = str(data['classCode'])
    passcode = str(data['passcode'])
    print(classCode, passcode)
    _class = db.classes.find_one({'classCode': classCode, 'passcode': passcode})
    if _class:
        setFaces(_class)
        return Response('success')
    else:
        return Response('Wronge credentials')


@app.route('/video')
def video():
    return Response(faceRec.get_frames(),mimetype='multipart/x-mixed-replace; boundary=frame')

if __name__=="__main__":
    app.run(debug=True, host='0.0.0.0', port=5050)