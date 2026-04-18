"use client";
import { useRef } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
const Register = () => {
    const router = useRouter();
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
    const usernameRef = useRef(null);
    const passwordRef = useRef(null);
    async function register() {
        const username = usernameRef.current?.value;
        const password = passwordRef.current?.value;
        try {
            const response = await axios.post(`${API_BASE_URL}/api/auth/register`, {
                username,
                password
            }, {
                withCredentials: true
            });
            console.log(response.data);
            if (response.data?.success) {
                router.push("/login");
                return;
            }
            alert("Signup failed");
        }
        catch (err) {
            const error = err;
            alert(error.response?.data?.message || "Signup failed");
        }
    }
    return (<div className="h-screen w-screen flex flex-col  justify-center items-center bg-gray-50 gap-4 ">

    <div className="font-helvetica text-5xl text-black tracking-tighter mb-10">
        Create workflows that handle failure for you 
    </div>

    <div className="flex flex-col gap-3.5 ">
    <input ref={usernameRef} placeholder="username" className="border text-black p-2 font-helvetica tracking-wider"/>
    <input ref={passwordRef} type="password" placeholder="password" className="border text-black p-2 font-helvetica tracking-wider"/>
    <button onClick={register} className="px-4 py-2 border text-black tracking-wider">Register</button>
    </div>



    </div>);
};
export default Register;
