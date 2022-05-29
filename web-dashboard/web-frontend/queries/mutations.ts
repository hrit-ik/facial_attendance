import { gql } from "@apollo/client";

export const AddNewClass = gql`
    mutation AddNewClass($name: String!, $timing: [String]!, $userId: ID!, $passcode: String!, $classCode: String!) {
        addClass(name: $name, timing: $timing, userId: $userId, passcode: $passcode, classCode: $classCode) {
            id
            name
            classCode
        }
    }
`

export const DeleteStudent = gql`
    mutation DeleteStudent($id: ID!) {
        deleteStudent(id: $id) {
            id
            name
        }
    }
`