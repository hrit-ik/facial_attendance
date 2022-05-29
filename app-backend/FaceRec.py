import face_recognition
import cv2
import numpy as np
from db_setup import db, redis_client
import datetime
import time

#setting numpy print options
np.set_printoptions(linewidth=np.inf)

#setting current date
now = datetime.datetime.now()
current_date = now.strftime("%d-%m-%Y")

# Function to get next day in unix time
def get_next_day_utime():
    unixtime = time.mktime((datetime.datetime.now().date() + datetime.timedelta(days=1)).timetuple())
    return unixtime

#Class with methods relating to face recognition
class FaceRec:
    def __init__(self, cam_num):
        self.face_locations = []
        self.face_encodings = []
        self.process_this_frame = True
    # Function to get numpy array from string stored in DB
    def getNumpyArray(self, arr_str):
        new_array = eval('np.array(' + arr_str + ')')
        return new_array
    #Function to check if the person is present in correct time range allowed by class
    def check_timing(self):
        x = datetime.datetime.now().time()
        if self.start_time <= self.end_time:
            return self.start_time <= x <= self.end_time
        else:
            return self.set_timing <= x or x <= self.end_time
    # Function to set timing for class
    def set_timing(self, timing):
        self.start_time = datetime.time(int(timing[0].split(':')[0]), int(timing[0].split(':')[1]), 0)
        self.end_time = datetime.time(int(timing[1].split(':')[0]), int(timing[1].split(':')[1]), 0)
    #Function to set encodings for students
    def encode(self, id_name_dict, face_encoding_arr, classId):
        self.classId = classId
        self.known_face_ids = list(id_name_dict.keys()) #gets the ids of the students
        self.known_face = id_name_dict #dictionary with ids as keys and name of students as values
        self.known_face_encodings = [self.getNumpyArray(face_encoding) for face_encoding in face_encoding_arr] #gets the face encodings array of the students from strings stored in DB
    def get_frames(self):
        self.video_capture = cv2.VideoCapture(0)
        while True:
            ret, frame = self.video_capture.read()
            frame = cv2.flip(frame, 1)
            # Resize frame of video to 1/4 size for faster face recognition processing
            small_frame = cv2.resize(frame, (0, 0), fx=0.25, fy=0.25)

            # Convert the image from BGR color (which OpenCV uses) to RGB color (which face_recognition uses)
            rgb_small_frame = small_frame[:, :, ::-1]

            # Only process every other frame of video to save time
            if self.process_this_frame:
                # Find all the faces and face encodings in the current frame of video
                self.face_locations = face_recognition.face_locations(rgb_small_frame)
                self.face_encodings = face_recognition.face_encodings(rgb_small_frame, self.face_locations)

                self.face_ids = []
                for face_encoding in self.face_encodings:
                    # See if the face is a match for the known face(s)
                    matches = face_recognition.compare_faces(self.known_face_encodings, face_encoding)
                    name = "Unknown"

                    # # If a match was found in known_face_encodings, just use the first one.
                    # if True in matches:
                    #     first_match_index = matches.index(True)
                    #     name = known_face_ids[first_match_index]

                    # Or instead, use the known face with the smallest distance to the new face
                    face_distances = face_recognition.face_distance(self.known_face_encodings, face_encoding)
                    best_match_index = np.argmin(face_distances)
                    if matches[best_match_index]:
                        label = self.known_face_ids[best_match_index] #gets the id of the student present in the frame
                        name = self.known_face[label] #gets the name of the same student
                        key = '{}_{}_{}'.format(self.classId, label, current_date) #formating attendance key to store in redis
                        if(redis_client.get(key)):
                            pass
                        else:
                            if(self.check_timing()):
                                # redis_client.set(key, 'marked', exat=get_next_day_utime()) #saving the key in redis which expires next day
                                redis_client.set(key, 'marked') #saving the key in redis which expires next day
                                attendance = db.attendances.find_one({'date': current_date, 'classId': self.classId}) #checking if attendance object for the day is already made
                                if attendance:
                                    db.attendances.update_one({'date': current_date, 'classId': self.classId}, {'$push': {'studentIds': label}}) #updating the attendance object if already made
                                else:
                                    db.attendances.insert_one({'date': current_date, 'classId': self.classId, 'studentIds': [label]}) #creating the attendance object if not made


                    self.face_ids.append(name) #appending the name of the student to the list of names before showing in the frame

            self.process_this_frame = not self.process_this_frame


            # Display the results
            for (top, right, bottom, left), name in zip(self.face_locations, self.face_ids):
                # Scale back up face locations since the frame we detected in was scaled to 1/4 size
                top *= 4
                right *= 4
                bottom *= 4
                left *= 4

                # Draw a box around the face
                cv2.rectangle(frame, (left, top), (right, bottom), (0, 0, 255), 2)

                # Draw a label with a name below the face
                cv2.rectangle(frame, (left, bottom - 35), (right, bottom), (0, 0, 255), cv2.FILLED)
                font = cv2.FONT_HERSHEY_DUPLEX
                cv2.putText(frame, name, (left + 6, bottom - 6), font, 1.0, (255, 255, 255), 1)

            # Display the resulting image
            ret,buffer=cv2.imencode('.jpg',frame)
            frame=buffer.tobytes()

            yield(b'--frame\r\n'
                    b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')

            # Hit 'q' on the keyboard to quit!
            if cv2.waitKey(1) & 0xFF == ord('q'):
                break
            

faceRec = FaceRec(0)