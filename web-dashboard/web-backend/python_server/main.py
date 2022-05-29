from flask import Flask, Response, request
import cv2
import numpy as np
from PIL import Image
from io import BytesIO
import face_recognition
import json
import requests
import pymongo
from flask_cors import CORS, cross_origin
from bson import ObjectId


app = Flask(__name__)
CORS(app)

np.set_printoptions(linewidth=np.inf)


mongo_client = pymongo.MongoClient("localhost", 27017)
db = mongo_client['graphql-demo']

def getFaceEncodings(img_url):
    response = requests.get(img_url)
    img = np.array(Image.open(BytesIO(response.content)))
    small_frame = cv2.resize(img, (0, 0), fx=0.25, fy=0.25)
    face_location = face_recognition.face_locations(small_frame)
    face_encoding = face_recognition.face_encodings(small_frame, face_location)
    return np.array2string(face_encoding[0], separator=',')


# def get_encodings():
#     image = request.get_json()
#     try:
#         face_encoding = getFaceEncodings(image['img_url'])
#         return face_encoding
#     except:
#         return {'face_encoding': 'no face detected'}


@app.route('/')
def read_root():
    print('hit')
    return {'hi': "hello"}

@app.route('/add_student_data', methods=['POST'])
def add_student_data():
    data = request.get_json()
    rollNo = data['rollNo']
    name, rollNo, profileUrl, classId = data['name'], data['rollNo'], data['profileUrl'], data['classId']
    print(name, rollNo, profileUrl)
    face_encoding = getFaceEncodings(profileUrl)
    found_student = db.students.find_one({'rollNo': rollNo})
    if found_student:
        db.students.find_one_and_update({'rollNo': rollNo},{'$push': {'classIds': ObjectId(classId)}})
        return 'Added student in new class'
    else:
        db.students.insert_one({'name': name, 'rollNo': rollNo, 'profileUrl': profileUrl, 'classIds': [ObjectId(classId)], 'faceEncoding': face_encoding})
        return 'Added student his first class'

if __name__ == '__main__':
      app.run(host='0.0.0.0', port=7777, debug=True)
