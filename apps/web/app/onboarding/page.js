"use client";
import { useEffect, useState } from "react";
import axios from "axios";
const Onboarding = () => {
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
    const [apikey, setapikey] = useState("");
    useEffect(() => {
        const theonboarding = async () => {
            try {
                const onboardingResponse = await axios.post(`${API_BASE_URL}/api/auth/onboarding`, {}, {
                    withCredentials: true
                });
                const key = onboardingResponse.data?.data;
                if (key) {
                    setapikey(key);
                }
            }
            catch (error) {
                console.error("Failed to load onboarding data", error);
                setapikey("");
            }
        };
        theonboarding();
    }, []);
    return (<div className="w-screen h-screen bg-gray-100 flex flex-col items-center justify-center gap-8 px-4 ">

    <h1 className="text-4xl font-helvetica text-black tracking-tighter ">your api key</h1>

 <p className="text-gray-500 text-center max-w-xl">
                Copy this key and embed it in your backend using the Dagflow SDK
            </p>

    <div className="flex items-center bg-white border border-gray-200 rounded-lg px-4 py-3 w-full max-w-lg gap-4">

   <span className="flex-1 text-sm font-mono text-gray-700 truncate">
                    {apikey || "Loading..."}
                </span>

    </div>


    </div>);
};
export default Onboarding;
