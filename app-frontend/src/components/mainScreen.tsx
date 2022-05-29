import React, { FC } from "react";

interface Props {
  classCode: string,
}

const MainScreen:FC<Props> = ({classCode}) => {
  const flaskAddress = "127.0.0.1"
  return (
    <div className="flex flex-col justify-center items-center h-screen relative">
      <h3 className="absolute top-10 text-gray-600 text-2xl">Your Attendance Is Being marked!</h3>
      <h4>Class Code: {classCode}</h4>
      <div className="shadow-xl h-3/4 rounded-xl absolute top-24">
          <img className='rounded-xl h-full'  src={`http://${flaskAddress}:5050/video`} alt="" />
      </div>
    </div>
  )
}

export default MainScreen
