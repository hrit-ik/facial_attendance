import * as React from 'react';
import SideMenu from "../../components/sidemenu";
import Accordion from '../../components/accordion';
import Select from 'react-select';
import { useState, useEffect } from 'react';
import cookies from 'next-cookies'
import client from "../../apollo-client";
import { getClassesUnderUser, getAttendanceWithStudentAndClass, getAttendanceWithClassAndDate } from '../../queries/queries';
import type { NextPage } from 'next'
import {ShowWithStudentsAndClass, ShowWithClassAndDate} from '../../components/showAttendanceData'
import {useQuery} from '@apollo/client'


interface Props {
  classes: any,
  userId: String,
}

export async function getServerSideProps(ctx:any) {
  const {jwt} = cookies(ctx)
  const {userId} = cookies(ctx)
  // console.log(ctx.req.cookies['jwt'])
  if(!jwt){
      ctx.res.writeHead(302, {
          Location: '/auth/login'
      })
      ctx.res.end()
  }
  const {data} = await client.query({
      query: getClassesUnderUser, //Query to get classes under current user on server side
      context: {
          headers: {
            cookie: ctx.req.headers.cookie
          }
      }
  })
  return {
      props: {
        classes: data.currentUser.classes,
        userId: userId
      }
  }
}


const Attendance:NextPage<Props> = ({classes}) => {
  const [classOptions, setClassOptions]:any = useState([]);
  // Seting options for class dropdowns
  useEffect(() => {
    const _classOptions:any = []
    classes.forEach((_class: any) => {
      _classOptions.push({
        label: _class.name,
        value: _class.id
      })
    })
    setClassOptions(_classOptions)
  }, [])

  const [selectedClass1, setSelectedClass1]:any = useState(null)
  const [selectedClass2, setSelectedClass2]:any = useState(null)
  const [studentOptions, setStudentOptions]:any = useState([])
  const [selectedStudent, setSelectedStudent]:any = useState(null)
  const [date, setDate] = useState('')
  const [loadData1, setLoadData1] = useState(false)
  const [loadData2, setLoadData2] = useState(false)

  // Setting options for student dropdown after selecting class
  useEffect(() => {
    setLoadData1(false)
    setSelectedStudent(null)
    if(selectedClass1) {
      console.log(selectedClass1)
      var _studentOptions:any = []
      const _class = classes.find((_class: any) => _class.id === selectedClass1.value)
      _class.students.forEach((student: any) => {
        _studentOptions.push({
          value: student.id,
          label: student.name
        })
      })
      setStudentOptions(_studentOptions)
    }
  }, [selectedClass1])
  
  //Function for handling submission of first form
  const handleSubmit1 = (e:any)=>{
    e.preventDefault()
    setLoadData2(false)
    console.log(selectedClass1.label, selectedStudent.value)
    if(!selectedClass1 || !selectedStudent){
      alert('Please select class and student')
    }
    else {
      setLoadData1(true)
    }
  }

  //Function for handling submission of second form
  const handleSubmit2 = (e:any)=>{
    e.preventDefault()
    setLoadData1(false)
    if(!selectedClass2 || !date){
      alert('Please select class and date')
    }
    else {
      setLoadData2(true)
    }
  }

  return (
    <div className="grid grid-cols-9 h-screen">
      <SideMenu />
      <div className="col-span-7 flex flex-col">
        <div className="flex w-full justify-around">
        <div className='w-1/2 mt-10'>
        <h1 className='text-center mb-5'>Search With Student and Class</h1>
          <form action="">
            <div className='flex justify-around'>
              <Select
                defaultValue={selectedClass1}
                onChange={setSelectedClass1}
                options={classOptions}
                placeholder="class"
                className='w-52'
                instanceId='1'
              />
              <Select
                defaultValue={selectedStudent}
                onChange={setSelectedStudent}
                options={studentOptions}
                value={selectedStudent}
                placeholder="student"
                className='w-52'
                instanceId='2'
              />
            </div>
            <div className='w-full flex justify-center mt-5'>
              <button className='btn-primary mt-5' onClick={handleSubmit1}>Search</button>
            </div>
          </form>
        </div>
        <div className='w-1/2 mt-10'>
        <h1 className='text-center mb-5'>Search With Class and Date</h1>
          <form action="">
            <div className='flex justify-around'>
              <Select
                defaultValue={selectedClass2}
                onChange={setSelectedClass2}
                options={classOptions}
                placeholder="class"
                className='w-52'
                instanceId='3'
              />
              <input className='ring-1 ring-gray-300 rounded px-1' type="date" name="date" id="date" onChange={(e)=>{
                setDate(e.target.value)
              }}/>
            </div>
            <div className='w-full flex justify-center mt-5'>
              <button className='btn-primary mt-5' onClick={handleSubmit2}>Search</button>
            </div>
          </form>
        </div>
        </div>
        {loadData1 && <ShowWithStudentsAndClass classId={selectedClass1.value} studentId={selectedStudent.value} loadData1={loadData1}/>}
        {loadData2 && <ShowWithClassAndDate classId={selectedClass2.value} date={date} loadData2={loadData2}/>}
      </div>
    </div>
  );
}


export default Attendance;
