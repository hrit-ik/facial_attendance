import * as React from 'react';
import SideMenu from "../../components/sidemenu";
// import StudentForm from '../../components/studentForm';
import Image from 'next/image';
import { TrashIcon } from '@heroicons/react/solid';
// import checkAuth from '../../utils/checkAuth';
import { useState, useEffect, useCallback } from 'react';
import client from "../../apollo-client";
import cookies from 'next-cookies'
import {getClassesUnderUser, getStudentsUnderUser} from '../../queries/queries'
// import { DeleteStudent } from '../../queries/mutations';
import type { NextPage } from 'next';
import Select from 'react-select';
import axios from 'axios';
import Dropzone from '../../components/dropzone';
import { gql, useQuery, useMutation } from '@apollo/client';
import {DeleteStudent} from '../../queries/mutations'
import { useRouter } from 'next/router';


interface Props {
  classes: any,
  userId: String,
}

export async function getServerSideProps(ctx:any) {
  const {jwt} = cookies(ctx)
  const {userId} = cookies(ctx)
    if(!jwt){
        ctx.res.writeHead(302, {
            Location: '/auth/login'
        })
        ctx.res.end()
    }
    const {data} = await client.query({
        query: getStudentsUnderUser, //Query to get Students under current user on server side
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

const Students: NextPage<Props> =  ({classes, userId}) => {
  // console.log(classes)
  const [studentName, setStudentName] = useState('');
  const [rollNo, setRollNo] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [selectedOption, setSelectedOption]:any = useState('');
  const [selectedOption2, setSelectedOption2]:any = useState('');
  // const [image, setImage ] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [deleteStudent, { data, loading, error }] = useMutation(DeleteStudent);
  const router = useRouter();

  // adding classes to the dropdown
  const options:any = [];
  classes.forEach((classObj: any) => {
    options.push({
      label: classObj.name,
      value: classObj.id
    })
  })

  // Function to add student
  const handleSubmit = async(e:any) => {
    if(!selectedOption || !studentName || !rollNo || !photoUrl){
      alert("Please fill all the fields")
      return
    }
    if(photoUrl.startsWith("http://res.cloudinary.com/") || photoUrl.startsWith("https://i.ibb.co")){
      const res = await axios.post('http://127.0.0.1:7777/add_student_data', {
        'name': studentName,
        'rollNo': rollNo,
        'profileUrl': photoUrl,
        'classId': selectedOption.value,
      },
      {
        headers: { 'content-type': 'application/json' },
      }
      )
      if(res.status === 200){
        alert("Student added successfully")
        router.replace(router.asPath)
      }
      else{
        alert('error')
      }
    }
    else{
      alert('Image Url is not valid')
      return
    }
    
  }

  // Function to handle deletion of student
  const handleDelete = async(id:any) => {
    var delCnfrm = window.confirm("Are you sure you want to delete this student?")
    if(delCnfrm){
      await deleteStudent({
        variables: {
          id: id
        }
      })
      alert('Student Deleted')
      router.replace(router.asPath)
    }
    else{
      return
    }
  }


  return (
    <div className="grid grid-cols-9 h-screen">
      <SideMenu />
      <div className=" col-span-5 px-10 py-3 overflow-scroll scrollbar-hide flex flex-col items-center">
        <Select
            defaultValue={selectedOption2}
            onChange={setSelectedOption2}
            options={options}
            placeholder="class"
            className='w-full mt-5'
            instanceId='2'
        />
        <div className='mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16'>
          {selectedOption2 && classes.find((classObj:any) => classObj.id === selectedOption2.value)?.students.map((student:any) => {
          return (
            <div key={student.id} className='col-span-1 rounded-lg shadow-lg flex flex-col justify-center items-center relative' style={{'width': 180}}>
              <div>
                <Image
                  src={student.profileUrl}
                  width={170}
                  height={210}
                  alt="profile"
                  className="rounded-md"
                />
              </div>
              <div className='mt-5 mb-2'>
                <div className='text-md font-semibold capitalize'>Name: <span className='text-md font-normal'>{student.name}</span></div>
                <div className='text-md font-semibold capitalize'>Roll No <span className='text-md font-normal'>{student.rollNo}</span></div>
                <div>
                  <TrashIcon className='text-gray-200 opacity-75 absolute right-1 top-1 hover:scale-150 cursor-pointer w-5' onClick={() => {handleDelete(student.id)}} />
                </div>
              </div>
            </div>
          )
        })}
      </div>
      </div>
      {/************************************ Form *****************************************/}
      <div className=" col-span-2 px-10 py-3 border-l-2 border-gray-200">
        {/* form to add a new class with class code and class passcode and class name */}
        <h1 className='text-2xl text-center'>Add Student</h1>
        <div className='h-72 mt-14 w-full text-lg'>
          <form action="">
            <div>
              <label htmlFor="studentName">Student Name</label>
              <input type="text" id="studentName" name="studentName" className='border-b-2 border-gray-300 focus:outline-none px-2 py-1 w-full mt-2'
                onChange={(e)=>{
                  setStudentName(e.target.value)
                }}
              />
            </div>
            <div className='mt-5'>
              <label htmlFor="rollNo">Roll Number</label>
              <input type="text" id="rollNo" name="rollNo" className='border-b-2 border-gray-300 focus:outline-none px-2 py-1 w-full mt-2'
                onChange={(e)=>{
                  setRollNo(e.target.value)
                }}
              />
            </div>
            <div className='mt-5'>
              <label htmlFor="photoUrl">Profile Url <span className='text-sm'>[upload on imagebb]</span></label>
              <input type="text" id="photoUrl" name="photoUrl" className='border-b-2 border-gray-300 focus:outline-none px-2 py-1 w-full mt-2'
                onChange={(e)=>{
                  setPhotoUrl(e.target.value)
                }}
              />
            </div>
            <h3 className='text-center text-sm mb-2 mt-2'>OR</h3>
            <Dropzone setIsUploading={setIsUploading} setPhotoUrl={setPhotoUrl}/>
            {isUploading && <p>Uploading...</p>}
            <div className='mt-5'>
              <h1>Select Class</h1>
              <Select
                  defaultValue={selectedOption}
                  onChange={setSelectedOption}
                  options={options}
                  placeholder="class"
                  className='w-full mt-5'
                  instanceId='1'
              />
            </div>
            <div className='mt-5'>
            </div>
            <div className='w-full flex justify-center mt-5'>
              <button className='btn-primary mt-5' onClick={handleSubmit}>Add</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}


export default Students;