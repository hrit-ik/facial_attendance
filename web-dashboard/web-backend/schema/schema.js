const graphql = require('graphql');
const _ = require('lodash');
// const {users, classes, students, attendance} = require('./../fakeData');
const User = require('./../models/user');
const Class = require('./../models/class');
const Student = require('./../models/student');
const Attendance = require('./../models/attendance');
// const { v4: uuidv4 } = require('uuid');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const {sign, verify} = require('jsonwebtoken');

const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLSchema,
    GraphQLID,
    GraphQLInt,
    GraphQLList,
    GraphQLNonNull  //To save mutations with empty fields
} = graphql;


/**************************  DEFINING USER OBJECT TYPE **************************/
const UserType = new GraphQLObjectType({
    name: 'User',
    fields: () => ({
        id: {type: GraphQLString},
        username: {type: GraphQLString},
        password: {type: GraphQLString},
        // DEFINING RELATIONSHIP OF USER WITH CLASSES UNDER HIS/HER CONTROL
        classes: {
            type: new GraphQLList(ClassType),
            async resolve(parent, args) {
                const classes = await Class.find({userId: parent.id});
                return classes;
            }
        },
    }),
})


/**************************  DEFINING CLASS OBJECT TYPE **************************/
const ClassType = new GraphQLObjectType({
    name: 'Class',
    fields: () => ({
        id: {type: GraphQLID},
        name: {type: GraphQLString},
        timing: {type: new GraphQLList(GraphQLString)},
        userId: {type: GraphQLString},
        classCode: {type: GraphQLString},
        passcode: {type: GraphQLString},
        // DEFINING RELATIONSHIP OF CLASS WITH ITS USER
        user: {
            type: UserType,
            async resolve(parent, args) {
                const user = await User.findById(parent.userId);
                return user;
            }
        },
        // DEFINING RELATIONSHIP OF CLASS WITH ITS STUDENTS
        students: {
            type: new GraphQLList(StudentType),
            async resolve(parent, args) {
                var _students = []
                const students = await Student.find({classIds: parent.id});
                return students;
            }
        },
        // DEFINING RELATIONSHIP OF CLASS WITH ATTENDANCE SAVED UNDER IT
        attendance: {
            type: new GraphQLList(AttendanceType),
            args: {date: {type: GraphQLString}},
            async resolve(parent, args) {
                if(args?.date) {
                    const attendance = await Attendance.find({classId: parent.id, date: args.date});
                    return attendance;
                }else{
                    const attendance =await  Attendance.find({classId: parent.id});
                    return attendance;
                }
            }
        }
    })
})


/**************************  DEFINING STUDENT OBJECT TYPE **************************/
const StudentType = new GraphQLObjectType({
    name: 'Student',
    fields: () => ({
        id: {type: GraphQLID},
        name: {type: GraphQLString},
        rollNo: {type: GraphQLString},
        faceEncoding: {type: GraphQLString},
        profileUrl: {type: GraphQLString},
        // DEFINING RELATIONSHIP OF STUDENT WITH ITS CLASSES
        classes: {
            type: new GraphQLList(ClassType),
            async resolve(parent, args) {
                const classIds = parent.classIds;
                const _classes = await Class.find({_id: {$in: classIds}});
                return _classes;
            }
        },
        class: {
            type: ClassType,
            args: {id: {type: GraphQLString}},
            async resolve(parent, args) {
                const classId = args.id;
                const _class = await Class.findById(classId);
                return _class;
            }
        },
        // DEFINING RELATIONSHIP OF STUDENT WITH ITS ATTENDANCE
        attendance: {
            type: new GraphQLList(AttendanceType),
            args: {date: {type: GraphQLString}, classId: {type: GraphQLID}},
            async resolve(parent, args) {
                if(args?.date){
                    const attendance = args?.classId ? await Attendance.find({classId: args.classId, date: args.date, studentIds: parent.id}) : await Attendance.find({date: args.date, studentIds: parent.id});
                    return attendance;
                }
                const attendance = args?.classId ? await Attendance.find({classId: args.classId, studentIds: parent.id}) : await Attendance.find({ studentIds: parent.id});
                return attendance;
            }
        }, 
    })
})


/**************************  DEFINING ATTENDANCE OBJECT TYPE **************************/
const AttendanceType = new GraphQLObjectType({
    name: 'Attendance',
    fields: () => ({
        id: {type: GraphQLID},
        date: {type: GraphQLString},
        // DEFINING RELATIONSHIP OF ATTENDANCE WITH STUDENTS
        students: {
            type: new GraphQLList(StudentType),
            async resolve(parent, args) {
                const students = await Student.find({_id: {$in: parent.studentIds}});
                return students;
            }
        },
        classId: {type: GraphQLID},
        class: {
            type: ClassType,
            async resolve(parent, args) {
                const classId = parent.classId;
                const _class = await Class.findById(classId);
                return _class;
            }
        }
    })
})


/**************************  DEFINING ROOT QUERY **************************/
const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        //QUERY FOR GETTING USER BY ID
        user: {
            type: UserType,
            args: {id: {type: GraphQLID}},
            async resolve(parent, args) {
                // return _.find(users, {id: args.id});
                const user = await User.findById(args.id)
                return user
            }
        },
        //QUERY FOR GETTING CLASS BY ID
        class: {
            type: ClassType,
            args: {id: {type: GraphQLID}},
            async resolve(parent, args) {
                const _class = await Class.findById(args.id)
                return _class
            }
        },
        //QUERY FOR GETTING STUDENT BY ID
        student: {
            type: StudentType,
            args: {id: {type: GraphQLID}},
            resolve(parent, args) {
                const student = Student.findById(args.id);
            }
        },
        //QUERY FOR GETTING ALL CLASSES
        classes: {
            type: new GraphQLList(ClassType),
            resolve(parent, args) {
                const classes = Class.find({});
                return classes;
            }
        },
        //QUERY FOR GETTING ALL STUDENTS
        students: {
            type: new GraphQLList(StudentType),
            resolve(parent, args) {
                const students = Student.find({});
                return students;
            }
        },
        student: {
            type: StudentType,
            args: {id: {type: GraphQLID}},
            async resolve(parent, args) {
                const student = await Student.findById(args.id);
                return student;
            }
        },
        //QUERY FOR GETTING ALL ATTENDANCES OR ATTENDANCE OF A PARTICULAR DATE
        attendance: {
            type: new GraphQLList(AttendanceType),
            args: {date: {type: GraphQLString}},
            resolve(parent, args) {
                if(args.date) {
                const attendance = Attendance.find({date: args.date});
                return attendance;
                }
                const attendance = Attendance.find({});
                return attendance;
            }
        },
        currentUser: {
            type: UserType,
            async resolve(parent, args, {req, res}) {
                const userId = req.cookies['userId'];
                const user = await User.findById(userId)
                return user ? user : null;
            }
        },
        getAttendanceWithStudentAndClass: {
            type: new GraphQLList(AttendanceType),
            args: {studentId: {type: GraphQLID}, classId: {type: GraphQLID}},
            async resolve(parent, args) {
                const attendance = await Attendance.find({studentIds: args.studentId, classId: args.classId});
                const dates = attendance.map(attendance => attendance.date);
                return attendance;
            }
        },
        getAttendanceWithClassAndDate: {
            type: new GraphQLList(AttendanceType),
            args: {classId: {type: GraphQLID}, date: {type: GraphQLString}},
            async resolve(parent, args) {
                const attendance = await Attendance.find({classId: args.classId, date: args.date});
                return attendance;
            }
        },
    }
})


/**************************  DEFINING MUTATIONS **************************/
const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        // MUTATION FOR CREATING NEW CLASS
        addClass: {
            type: ClassType,
            args: {
                name: {type: new GraphQLNonNull(GraphQLString)},
                timing: {type: new GraphQLNonNull(new GraphQLList(GraphQLString))},
                userId: {type: new GraphQLNonNull(GraphQLID)},
                passcode: {type: new GraphQLNonNull(GraphQLString)},
                classCode: {type: new GraphQLNonNull(GraphQLString)},
            },
            async resolve(parent, args) {
                const _class = await Class.findOne({name: args.name, passcode: args.passcode});
                if(_class) {
                    _class.timing = args.timing;
                    _class.save()
                    return _class;
                }
                else{
                    const class_ = new Class({
                        name: args.name,
                        timing: args.timing,
                        userId: args.userId,
                        passcode: args.passcode,
                        classCode: args.classCode,
                    })
                    await class_.save();
                    return class_;
                }
            }
        },
        // MUTATION FOR EDITING CLASS TIMINGS
        updateClass: {
            type: ClassType,
            args: {
                id: {type: GraphQLID},
                timing: {type: new GraphQLList(GraphQLString)},

            },
            async resolve(parent, args) {
                const class_ = await Class.findById(args.id)
                class_.timing = args.timing
                await class_.save();
                return class_
            }
        },
        // MUTATION FOR CREATING NEW STUDENT
        addStudent: {
            type: StudentType,
            args: {
                name: {type: GraphQLString},
                rollNo: {type: GraphQLString},
                faceEncoding: {type: GraphQLString},
                profileUrl: {type: GraphQLString},
                classId: {type: GraphQLID},
            },
            async resolve(parent, args) {
                const _student = await Student.findOne({rollNo: args.rollNo})
                if(_student) {
                    _student.classIds.push(args.classId)
                    await _student.save()
                    return _student
                }
                else{
                const student = new Student({
                    name: args.name,
                    rollNo: args.rollNo,
                    faceEncoding: args.faceEncoding,
                    profileUrl: args.profileUrl,
                })
                student.classIds.push(args.classId);
                await student.save();
                return student;
            }
            }
        },
        // MUTATION FOR ADDING STUDENTS TO NEW CLASS
        updateStudent: {
            type: StudentType,
            args: {
                id: {type: GraphQLID},
                classId: {type: GraphQLID},
            },
            async resolve(parent, args) {
                const id = args.id;
                const student = await Student.findOne({_id: id});
                student.classIds.push(args.classId);
                await student.save();
                return student;
            }
        },
        // Mutation for deleting a student
        deleteStudent: {
            type: StudentType,
            args: {
                id: {type: GraphQLID},
            },
            async resolve(parent, args) {
                const id = args.id;
                const student = await Student.findOne({_id: id});
                await student.remove();
                return student;
            }
        },
        // MUTATION FOR CREATING NEW ATTENDANCE
        addAttendance: {
            type: AttendanceType,
            args: {
                date: {type: new GraphQLNonNull(GraphQLString)},
                classId: {type: new GraphQLNonNull(GraphQLID)},
                studentId: {type: new GraphQLNonNull(GraphQLID)},
            },
            async resolve(parent, args) {
                const attendance = await Attendance.findOne({date: args.date, classId: args.classId});
                if(attendance) {
                    attendance.studentIds.push(args.studentId);
                    await attendance.save();
                    return attendance;
                }
                else {
                    const attendance = new Attendance({
                        date: args.date,
                        classId: args.classId,
                        studentIds: [args.studentId]
                    })
                    await attendance.save();
                    return attendance;
                }
            },
        },
    }
})



module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
});