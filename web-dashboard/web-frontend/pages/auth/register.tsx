import type { NextPage } from 'next'
import {useState} from 'react'
import Axios from 'axios'
import Cookies from 'js-cookie'
import { useEffect } from 'react'

const Register: NextPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [user, setUser] = useState(null);

  
  const handleSubmit = async (e:any) => {
    e.preventDefault();
    Axios({
      url: 'http://localhost:5000/auth/register',
      method: 'POST',
      data: {
        email,
        username,
        password
      },
    }).then(res => {
      alert(res.data.user._id)
      alert('registration successful you can now login')
    }).catch(err => {
        alert('registration failed')
    })
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
          <h1 className='text-3xl lg:text-7xl'>Dashboard</h1>
        </div>
        <div className='col-span-1 flex justify-center items-center'>
          <div>
            <form action="">
                <div>
                  <label htmlFor="email" className='text-lg'>Email</label>
                  <input type="text" id="email" name="emsil" className='border-b-2 border-gray-300 focus:outline-none px-2 py-1 w-36 lg:w-full mt-2' onChange={(e) => setEmail(e.target.value)}/>
                </div>
                <div>
                  <label htmlFor="username" className='text-lg'>Username</label>
                  <input type="text" id="username" name="username" className='border-b-2 border-gray-300 focus:outline-none px-2 py-1 lg:w-full mt-2' onChange={(e) => setUsername(e.target.value)}/>
                </div>
                <div className='mt-2'>
                  <label htmlFor="password" className='text-lg'>Password</label>
                  <input type="password" id="password" name="password" className='border-b-2 border-gray-300 focus:outline-none px-2 py-1 w-full mt-1' onChange={(e) => setPassword(e.target.value)}/>
                </div>
            </form>
            <button className='btn-primary mt-5' onClick={handleSubmit}>Register</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register;