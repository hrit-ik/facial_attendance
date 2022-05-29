import router from 'next/router'
import Cookies from 'js-cookie'
import { useEffect } from 'react'

const LogoutFunc = () => {
    useEffect(() => {
        if(Cookies.get('jwt')){
            Cookies.remove('jwt')
            router.push('/auth/login')
        }
    }, [1])
    return null
}

export default LogoutFunc