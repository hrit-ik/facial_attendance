import Link from "next/link";
import { useRouter } from 'next/router';
import axios from 'axios';

interface SideMenuProps {
    colSpan: number
}

function getClassName(path: string): string{
    const router = useRouter();
    if(router.pathname == path){
        return 'flex items-center hover:cursor-pointer active-menu-link'
    }
    return 'flex items-center hover:cursor-pointer menu-link'
}

const SideMenu = () => {
    const router = useRouter();
    const handleLogout = () => {
        axios.get('http://localhost:4000/logout', {withCredentials: true})
        router.push('/auth/login')
    }

    return(
        <div className={'col-span-2 flex flex-col justify-start items-center p-3 h-screen font-mono border-r-2 border-gray-200'}>
                <div>
                    <p className="text-3xl">Dashboard Menu</p>
                </div>
                <div className="mt-5 flex flex-col justify-evenly h-full">
                    <Link href="/dashboard"><div className={getClassName('/dashboard')}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                        <p>Dashboard</p>
                    </div></Link>

                    <Link href="/dashboard/classes"><div className={getClassName('/dashboard/classes')}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                        <p>Classes</p>
                    </div></Link>
                    <Link href="/dashboard/students"><div className={getClassName('/dashboard/students')}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <p>Students</p>
                    </div></Link>
                    <Link href="/dashboard/attendance"><div className={getClassName('/dashboard/attendance')}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                        </svg>
                        <p>Attendance</p>
                    </div></Link>
                </div>
                <button className="absolute bottom-2 left-3 px-2 py-1 rounded hover:shadow-md ring-1 outline-2 outline-dashed" onClick={handleLogout}>
                        Logout
                </button>
            </div>
    )
}

export default SideMenu;