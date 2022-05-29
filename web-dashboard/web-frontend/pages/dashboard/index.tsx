import Link from "next/link";
import type { NextPage } from 'next'
import SideMenu from "../../components/sidemenu";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axios from "axios";
// import checkAuth from "../../utils/checkAuth";
import { gql } from "@apollo/client";
import client from "../../apollo-client";
import cookies from 'next-cookies'
import { useQuery } from "@apollo/client";
import {getCurrentUser, getClassesUnderUser} from '../../queries/queries'

interface Props {
    user: any;
}

export async function getServerSideProps(ctx:any) {
    const {jwt} = cookies(ctx)
    const {userId} = cookies(ctx)
    console.log(ctx.req.cookies['jwt'])
    if(!jwt){
        ctx.res.writeHead(302, {
            Location: '/auth/login'
        })
        ctx.res.end()
    }
    const {data} = await client.query({
        query: getCurrentUser, //Query to get current user
        context: {
            headers: {
              cookie: ctx.req.headers.cookie
            }
        }
    })
    return {
        props: {
            user: data.currentUser
        }
    }
}

const Dashboard: NextPage <Props> = ({user}) => {
   const {username, id} = user
   return(
            <div className="grid grid-cols-9">
                <SideMenu />
                <div className=" col-span-7 px-10 py-3">
                    <div className="flex flex-col items-center h-full justify-around"> 
                        <h1 className="text-3xl">Welcome {username}!</h1>
                        <div className="flex flex-col card text-center h-52 justify-center">
                            <h1 className="text-6xl">Your Dashboard Is Ready!</h1>
                            <p className="text-4xl mt-3">🚀</p>
                        </div>
                    </div>
                </div>
            </div>
         )
        
}
 
export default Dashboard;