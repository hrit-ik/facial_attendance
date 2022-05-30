
# facial_attendance

This is an attendance management system making use Face Recognition.

This Project has two main parts. First there is a desktop app from which target can submit their attendance. Then there is a web dashboard from which admin can manage classes, students, and can see all the attendance data.

**DB Setup**
You Should Have MongoDB installed localy to run this project.
[Instructions](https://www.mongodb.com/docs/manual/administration/install-community/)
You can use [Robo3T](https://robomongo.org/) to import the demo db collection from [here](https://drive.google.com/drive/folders/15WTMVVQRNg8OaDjZQsl4P5e9MGJSLNNG?usp=sharing)
Mongo is connected at three places. At app/app-backend/db-setup, web-dashboard/web-backend/app.js and web-dashboard/web-backend/python-server/main.py. You can change the connection on these code-blocks to connect to mongo Atlas or any other local collection.

**Intalling Dependencies**
1) Inside folders app/app-frontend, web-dashboard/web-backend, and web-dashboard/web-frontend install node_modules modules.

    `npm install`

2) Inside folders app/app-backend, web-dashboard/web-backend/python-server: 
	i) Make virtual envs
	
    `python3 -m venv env`
    
    ii) Activate env in shell
	    	On windows: `env\Scripts\activate.bat`
		On MacOS and Linux: `source ./env/bin/activate`
		
	iii) Install dependencies: 
    `pip install -r ./requirements.txt`

## APP

**Usage**


1) Make sure you have redis installed and running on your system.
[Instructions](https://redis.io/docs/getting-started/) 
2) Cd into the app/app-backend forlder and start the server at port 5050.

    `cd app/app-backend`
    `python3 main.py`
3) You can directly start the macOS [Build](https://github.com/hrit-ik/facial_attendance/tree/main/app/app-frontend/macos_build/app-frontend.app/Contents/MacOS) or can start the react app from app/app-frontend.

    `npm start`
    
 4) Enter Class Code and Passcode for any class and enter the app.
 5) Now if the app detects face of any student present in the class whose attendance has not been marked previously will be marked. He should be in time foor the class, otherwise attendance will not be marked.

** Make sure to check timing for the class in a the dashboard before marking the attendance.
 	
**Build**

To build the app on your machine follow the instuctions: 

1) Add Tauri in the react project (app/app-frontend)

    `npm  install @tauri-apps/api`

2) Initialize tauri in project.

    `npm run tauri init`

3) Start the React App on port 3000

    `npm start`

4) Start tauri dev

    `npx run tauri dev`

5) If everything in dev application is looking fine, build with: 

    `npm run bundle`


## Dashboard

**Usage**
1) Cd into web-dashboard/web-backend and start the dev server at port 4000.
	

    `cd web-dashboard/web-backend`
    `nodemon app.js`

2) Cd into web-dashboard/web-frontend to start nextJS dashboard at port 3001.
3) Login or Register a user and enter the dashboard.

**Features**
1) You can login or register a new user.
2) You can add classes under user.
3) If we add a class with same name and passcode the new time will be saved for same class.
4) You can add student to those classes.
5) If you add a student with same rollNo again with a different class, he will be added in the new class and will also be in old class (Students can be in multiple classes).
6) We can delete students.
7) We can see attendance data with student of a class, or of a class on a specific date. 

**Bugs**
1) As the classes and students are server side rendered we have to refresh the dev server to see the result after adding classes or students.

## Images

**App Flowchart**

![enter image description here](https://i.ibb.co/8D8ZnLq/Screenshot-2022-05-30-at-1-55-08-AM.png)


**Dashboard Flowchart**

![enter image description here](https://i.ibb.co/Lhj6bFZ/Screenshot-2022-05-30-at-1-55-49-AM.png)

