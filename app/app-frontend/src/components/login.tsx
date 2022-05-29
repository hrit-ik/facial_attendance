import { useState, useEffect} from "react";
import React, { FC } from "react";
import axios from "axios";

interface Props{
    setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>,
    setClassCode: React.Dispatch<React.SetStateAction<string>>,
}

const Login:FC<Props> = ({setIsLoggedIn})=>{
    const [classCode, setClassCode] = useState('')
    const [passcode, setPasscode] = useState('')
    
    const handleSubmit = async(e:any)=>{
        e.preventDefault()
        try{
        const res = await axios.post('http://127.0.0.1:5050/login', {
            'classCode': classCode,
            'passcode': passcode
        })
        if(res.data === 'success'){
            console.log('success')
            setClassCode('')
            setPasscode('')
            setIsLoggedIn(true)
        }
        else{
            console.log('fail')
            alert('wrong credentials')
            setClassCode('')
            setPasscode('')
        }
        
    }
    catch(err:any){
        if(err.message === 'Network Error'){
            alert('Please turn on the python server at port 5050');
            setClassCode('')
            setPasscode('') 
        }
        else{
            alert(err.message)
            setClassCode('')
            setPasscode('')
        }
    }
    }

    return(
        <section className="flex justify-center h-screen items-center">
        <div className="w-full max-w-xs">
            <h1 className="text-center text-2xl mb-4">
                Sign in
            </h1>
            <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4" action="/login" method="POST">
                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="className-code">
                        Class Code
                    </label>
                    <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" id="className-code" value={classCode} type="text" name="text" placeholder="Code" 
                        onChange={(e)=>{
                            setClassCode(e.target.value)
                        }}
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                        Password
                    </label>
                    <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" id="password" value={passcode} type="password" name="password" placeholder="******************" 
                        onChange={(e)=>{
                            setPasscode(e.target.value)
                        }}
                    />
                </div>
                <div className="flex flex-col items-center justify-between">
                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit" 
                        onClick={handleSubmit}
                    >
                        Sign In
                    </button>
                </div>
            </form>
        </div>
    </section>
    )
}


export default Login;