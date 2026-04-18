"use client"

import { useRef } from "react"
import axios , { AxiosError } from "axios"
import { useRouter } from "next/navigation"


const Login = () => {
const router = useRouter()

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"


const usernameRef = useRef <HTMLInputElement | null >(null)
const passwordRef = useRef <HTMLInputElement | null >(null)


async function login (){

const username = usernameRef.current?.value
const password = passwordRef.current?.value

if(!username || !password){
    alert("Username and password are required")
    return
}

try{
    const response =await  axios.post(`${API_BASE_URL}/api/auth/login` , {
        username , 
        password
    }, {
        withCredentials : true 
    })
    console.log(response.data)

        if (response.data?.success) {
            if (response.data.data.user?.hasOnboarded) {
                router.push("/workflowsdashboard")
            } else {
                router.push("/onboarding")
            }
            return
        }

    alert("Login failed")
    
} catch(err : unknown){
    const error =  err as AxiosError<{data?: string; message?: string}>
    alert(error.response?.data?.data || error.response?.data?.message || "Login failed")
}



}


return(
<div className="h-screen w-screen flex flex-col  justify-center items-center bg-gray-50 gap-4 ">

    <div className="font-helvetica text-5xl text-black tracking-tighter mb-10" >
welome back     </div>

    <div className="flex flex-col gap-3.5 " >
<input ref={usernameRef} placeholder="username" className="border text-black p-2 font-helvetica tracking-wider" />
<input ref={passwordRef} type="password" placeholder="password" className="border text-black p-2 font-helvetica tracking-wider" />
<button onClick={login} className="px-4 py-2 border text-black tracking-wider" >Login</button>
    </div>



</div>



)

}

export default Login