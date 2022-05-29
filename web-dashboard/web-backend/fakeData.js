module.exports.users = [
    {
        id: '1',
        username: 'John',
        password: '123456',
    },
    {
        id: '2',
        username: 'Sara',
        password: '12345678',
    },
    {
        id: '3',
        username: 'Karen',
        password: '123456789',
    },
    {
        id: '4',
        username: 'Steve',
        password: '123456'
    },
    {
        id: '5',
        username: 'Martin',
        password: '12356789'
    }
]

module.exports.classes = [
    {
        id: '1',
        name: 'React',
        userId: '1',
        timing: ["9:00", "10:00"]       
    },
    {
        id: '2',
        name: 'Node',
        userId: '2',
        timing: ["10:00", "11:00"]
    },
    {
        id: '3',
        name: 'Angular',
        userId: '3',
        timing: ["12:30", "2:30"] 
    }
]



module.exports.students = [
    {
        id: '1',
        name: 'Ram',
        rollNo: '1',
        classIds: ['1', '2', '3'],
        faceEncoding: "",
        profileUrl: "",
    },
    {
        id: '2',
        name: 'Shyam',
        rollNo: '2',
        classIds: ['1'],
        faceEncoding: "",
        profileUrl: "",
    },
    {
        id: '3',
        name: 'Mohan',
        rollNo: '3',
        classIds: ['1', '2'],
        faceEncoding: "",
        profileUrl: "",
    },
    {
        id: '4',
        name: 'Sohan',
        rollNo: '4',
        classIds: ['1'],
        faceEncoding: "",
        profileUrl: "",
    },
    {
        id: '5',
        name: 'Rohan',
        rollNo: '5',
        classIds: ['1'],
        faceEncoding: "",
        profileUrl: "",
    },
    {
        id: '6',
        name: 'Raj',
        rollNo: '6',
        classIds: ['2'],
        faceEncoding: "",
        profileUrl: "",
    },
    {
        id: '7',
        name: 'Ravi',
        rollNo: '7',
        classIds: ['2'],
        faceEncoding: "",
        profileUrl: "",
    },
    {
        id: '8',
        name: 'Rakesh',
        rollNo: '8',
        classIds: ['2', '1'],
        faceEncoding: "",
        profileUrl: "",
    },
    {
        id: '9',
        name: 'Rakesh',
        rollNo: '9',
        classIds: ['2'],
        faceEncoding: "",
        profileUrl: "",
    },
    {
        id: '10',
        name: 'Rakesh',
        rollNo: '10',
        classIds: ['2'],
        faceEncoding: "",
        profileUrl: "",
    },
    {
        id: '11',
        name: 'Seeta',
        rollNo: '11',
        classIds: ['3', '1'],
        faceEncoding: "",
        profileUrl: "",
    },
    {
        id: '12',
        name: 'Seeta',
        rollNo: '12',
        classIds: ['3'],
        faceEncoding: "",
        profileUrl: "",
    },
    {
        id: '13',
        name: 'Seeta',
        rollNo: '13',
        classIds: ['3', '2'],
        faceEncoding: "",
        profileUrl: "",
    },
    {
        id: '14',
        name: 'Seeta',
        rollNo: '14',
        classIds: ['3'],
        faceEncoding: "",
        profileUrl: "",
    },
    {
        id: '15',
        name: 'Seeta',
        rollNo: '15',
        classIds: ['3'],
        faceEncoding: "",
        profileUrl: "",
    }
]

module.exports.attendance = [
    {
        date: '2019-01-01',
        studentIds: ['1', '2', '4'],
        classId: '1'
    },
    {
        date: '2019-01-02',
        studentIds: ['1', '2', '3', '4'],
        classId: '1'
    },
    {
        date: '2019-01-03',
        studentIds: ['1', '3'],
        classId: '1'
    },
    {
        date: '2019-01-04',
        studentIds: ['1', '2', '3', '4', '5'],
        classId: '1'
    },
    {
        date: '2019-01-01',
        studentIds: ['6', '8', '9'],
        classId: '2'
    },
    {
        date: '2019-01-02',
        studentIds: ['6', '8', '9', '10'],
        classId: '2'
    },
    {
        date: '2019-01-03',
        studentIds: ['6', '10'],
        classId: '2'
    },
    {
        date: '2019-01-04',
        studentIds: ['6', '8', '9', '10', '7'],
        classId: '2'
    },
    {
        date: '2019-01-01',
        studentIds: ['11', '12', '13'],
        classId: '3'
    },
    {
        date: '2019-01-02',
        studentIds: ['11', '12', '13', '14'],
        classId: '3'
    },
    {
        date: '2019-01-03',
        studentIds: ['11', '14'],
        classId: '3'
    },
    {
        date: '2019-01-04',
        studentIds: ['11', '12', '13', '14', '15', '4'],
        classId: '3'
    }
]