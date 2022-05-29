import type { NextPage } from 'next'
import {useState} from 'react'
import axios from 'axios'
import Cookies from 'js-cookie'
import { useEffect } from 'react'
import { useRouter } from 'next/router'

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);
  const router = useRouter()

  // Function to handle the login
  const handleSubmit = async (e:any) => {
    e.preventDefault();
    const res = await axios.post('http://localhost:4000/login', {
      username,
      password
    },
    {withCredentials: true}
    )
    if(res.status === 200){
      console.log(res.data)
      // Cookies.set('jwt', res.data.jwt)
      alert('logged in successfully!')
      router.push('/dashboard')
    }
    else if(res.status === 401 || 400){
      alert('Invalid Credentials')
    }
    else{
      alert('Something went wrong')
    }
}

// Function to handle the signup
const handleSubmit2 = async (e:any) => {
  e.preventDefault();
    const res = await axios.post('http://localhost:4000/register', {
      username,
      password
    },
    {withCredentials: true}
    )
    if(res.status === 200){
      alert("Registered successfully! You can now login.")
    }
    else if(res.status === 401 || 400){
      alert('Invalid Credentials')
    }
    else{
      alert('Something went wrong')
    }
}


  useEffect(() => {
    console.log(user);
    if (user) {
      Cookies.set('user', user);
    }
  }, [user])
  
  return(
    <div className='h-screen w-screen flex justify-center items-center'>
      <div className='grid grid-cols-2 h-4/5 w-4/5 shadow-lg rounded-md'>
        <div className='col-span-1 flex justify-center items-center border-r-2 border-gray-100'>
          <h1 className='text-3xl md:text-7xl'>Dashboard</h1>
        </div>
        <div className='col-span-1 flex justify-center items-center'>
          <div>
            <form action="">
                <div>
                  <label htmlFor="username" className='text-lg'>Username</label>
                  <input type="text" id="username" name="username" className='border-b-2 border-gray-300 focus:outline-none px-2 py-1 w-full mt-2' onChange={(e) => setUsername(e.target.value)}/>
                </div>
                <div className='mt-2'>
                  <label htmlFor="password" className='text-lg'>Password</label>
                  <input type="password" id="password" name="password" className='border-b-2 border-gray-300 focus:outline-none px-2 py-1 w-full mt-1' onChange={(e) => setPassword(e.target.value)}/>
                </div>
            </form>
            <div>
              <button className='btn-primary mt-5 mr-2' onClick={handleSubmit}>Login</button>
              <button className='btn-primary mt-5 mr-2' onClick={handleSubmit2}>Register</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login;