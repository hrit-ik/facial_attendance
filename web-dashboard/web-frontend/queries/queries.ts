// import checkAuth from "../../utils/checkAuth";
import { gql } from "@apollo/client";

export const getCurrentUser = gql`
    query {
        currentUser{
            id
            username
        }
    }
`

export const getClassesUnderUser = gql`
query {
    currentUser{
        username
        classes{
            id
            name
            timing
            userId
            passcode
            classCode
            students{
                id
                name
            }
        }
    }
}`

export const getClassesUnderUserWithId = gql`
query getStudentsUnderUser($id: ID!) {
    user(id: $id){
        username
        classes{
            id
            name
            timing
            userId
            passcode
            classCode
            students{
                id
                name
                profileUrl
                rollNo
            }
        }
    }
}`


export const getStudentsUnderUser = gql`
query {
    currentUser{
        username
        classes{
            id
            name
            students{
                id
                name
                profileUrl
                rollNo
            }
        }
        }
}`


export const getAttendanceWithStudentAndClass = gql`
query getAttendanceWithStudentAndClass($classId: ID!, $studentId: ID!) {
    getAttendanceWithStudentAndClass(classId: $classId, studentId: $studentId){
        date
        students{
            id
            name
        }
    }
}`

export const getAttendanceWithClassAndDate = gql`
query getAttendanceWithClassAndDate($classId: ID!, $date: String!) {
    getAttendanceWithClassAndDate(classId: $classId, date: $date){
        date
        students{
            id
            name
        }
    }
}`
