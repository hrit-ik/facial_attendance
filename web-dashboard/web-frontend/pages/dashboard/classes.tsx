import * as React from 'react';
import SideMenu from "../../components/sidemenu";
import client from "../../apollo-client";
import cookies from 'next-cookies'
import {getClassesUnderUser} from '../../queries/queries'
import type { NextPage } from 'next'
import {useState, useEffect} from 'react'
import { gql, useQuery, useMutation } from '@apollo/client';
import {AddNewClass} from '../../queries/mutations'
import ShortUniqueId from 'short-unique-id'
import { useRouter } from 'next/router';

const uid = new ShortUniqueId();

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


const Classes: NextPage <Props> = ({classes, userId}) => {
  const [className, setClassName] = useState('')
  const [passcode, setPasscode] = useState('')
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')
  const [addClass, { data, loading, error }] = useMutation(AddNewClass);
  const router = useRouter()

  // Function to add new class
  const handleSubmit = ()=>{
    const variables =  { 
      name: className,
      passcode: passcode,
      timing: [startTime, endTime],
      userId: userId,
      classCode: uid.randomUUID(10)
     }
    addClass({variables})
    if(!loading && !error){
      router.replace(router.asPath)
      console.log(classes)
    }
  }

  return (
    <div className="grid grid-cols-9 h-screen">
      <SideMenu />
      <div className="col-span-5 px-10 py-3 grid grid-cols-3 gap-3 overflow-scroll scrollbar-hide">
          {classes.map((classItem:any)=>{
            return (
              <div className="col-span-3 p-3 hover:shadow-xl rounded-lg shadow-md h-24" key={classItem.id}>
                <h1 className="text-xl text-center">{classItem.name}</h1>
                <h2 className='text-sm text-center'>[{classItem.classCode}, {classItem.passcode}]</h2>
                <h3 className="text-sm text-center">{classItem.timing[0]} - {classItem.timing[1]}</h3>
              </div>
            )
          })}
      </div>
      <div className=" col-span-2 px-10 py-3 border-l-2 border-gray-200">
        {/* form to add a new class with class code and class passcode and class name */}
        <h1 className='text-2xl text-center'>Add new Class</h1>
        <div className='h-72 mt-14 w-full text-lg'>
          <form action="" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="className">Class Name</label>
              <input type="text" id="className" name="className" className='border-b-2 border-gray-300 focus:outline-none px-2 py-1 w-full mt-2' onChange={(e)=>{
                setClassName(e.target.value)
              }}/>
            </div>
            <div className='mt-5'>
              <label htmlFor="classPasscode">Class Passcode</label>
              <input type="text" id="classPasscode" name="classPasscode" className='border-b-2 border-gray-300 focus:outline-none px-2 py-1 w-full mt-2' onChange={(e)=>{
                setPasscode(e.target.value)
              }}/>
            </div>
            <div className='mt-5'>
              <label htmlFor="appt">Start:</label>
              <input className='ml-5' type="time" id="startTime" name="startTime" onChange={(e)=>{
                setStartTime(e.target.value)
              }}/>
            </div>
            <div className='mt-5'>
              <label htmlFor="appt">End:</label>
              <input className='ml-5' type="time" id="endTime" name="endTime" onChange={(e)=>{
                setEndTime(e.target.value)
              }} />
            </div>
            <div className='w-full flex justify-center mt-5'>
              <button className='btn-primary mt-5'>Add</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Classes;