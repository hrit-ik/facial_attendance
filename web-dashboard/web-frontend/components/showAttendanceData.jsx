import { getClassesUnderUser, getAttendanceWithStudentAndClass, getAttendanceWithClassAndDate } from '../queries/queries';
import { gql, useQuery } from '@apollo/client';
import client from '../apollo-client'
import { useEffect } from 'react';

export const ShowWithStudentsAndClass = ({classId, studentId, loadData1}) => {
    const { loading, error, data } = useQuery(getAttendanceWithStudentAndClass, {
        variables: {
            studentId,
            classId
        }
    });

    async function refetchQueries() {
        await client.refetchQueries({
            include: ["getAttendanceWithStudentAndClass"],
        });
    }
    useEffect(()=>{
        if(loadData1){
            refetchQueries()
        }
    }, [loadData1]) 

    if (loading) return <p>Loading...</p>;
    const attendance = data.getAttendanceWithStudentAndClass;
    if(attendance.length === 0) return <p>No attendance data</p>;
    return(
        <div className='mt-20 flex'>
            { 
                attendance.map((attendance, i) => {
                    return(
                        <div key={i} className="bg-zinc-700 text-white px-2 py-2 rounded-md hover:shadow-lg m-2">
                            {attendance.date}
                        </div>
                    )
                })
            }
        </div>
    )
}

export const ShowWithClassAndDate = ({classId, date, loadData2}) => {
    date = date.split('-')[2] + '-' + date.split('-')[1] + '-' + date.split('-')[0];
    const { loading, error, data } = useQuery(getAttendanceWithClassAndDate, {
        variables: {
            classId,
            date
        }
    });

    async function refetchQueries() {
        await client.refetchQueries({
            include: ["getAttendanceWithClassAndDate"],
        });
    }
    useEffect(()=>{
        if(loadData2){
            refetchQueries()
        }
    }, [loadData2]) 

    if (loading) return <p>Loading...</p>;
    const attendance = data.getAttendanceWithClassAndDate[0]
    if(!attendance) return <p>No attendance data</p>;
    return(
        <div className='mt-20 flex'>
            { 
                attendance.students.map((student) => {
                    return(
                        <div key={student.id} className="bg-zinc-700 text-white px-2 py-2 rounded-md hover:shadow-lg m-2">
                            {student.name}
                        </div>
                    )
                })
            }
        </div>
    )
}
