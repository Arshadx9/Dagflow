"use client";
import axios , { AxiosError } from "axios";
import { useState , useEffect } from "react";
import { useRouter } from "next/navigation";

type workflow = {
    wid : string,
    name : string ,
    isActive : boolean,
    createdAt : string
}



type ApiResponse = {
  data: {
    workflows: workflow[];
  };
};


const formatDate = (dateString : string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
        month : "short",
        day : "numeric",
        year :"numeric"
    })
}

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true
})




const WorkflowDashboardPage = () => {

  const router = useRouter();

    const [workflows, setWorkflows] = useState<workflow[]>([])
const [loading, setLoading] = useState(true)
const [error, setError] = useState<string | null>(null) 




useEffect(() => {
  const fetchworkflow = async () => {
    try {
      setError(null)
      setLoading(true)

      const response = await api.get<ApiResponse>("/api/workflow/getworkflow")
      const workflowdata = response.data.data.workflows
      setWorkflows(workflowdata)

        

    } catch (err) {
      if (axios.isAxiosError(err)) {
        const axiosError: AxiosError<{ message: string }> = err

        if (axiosError.response?.status === 401) {
          router.push("/login")
        } else {
          setError(axiosError.response?.data?.message || "Failed to load workflows")
        }
      } else {
        setError("Something went wrong")
      }
    } finally {
      setLoading(false)
    }
  }

  fetchworkflow()
}, [router])





return(
    <div className="h-screen min-w-screen bg-gray-50">


<div className="flex justify-between p-4 items-center bg-gray-100 m-4 border border-gray-500 "  >
<div className="text-black font-helvetica tracking-tight " >Your workflows</div>
<div>
    <button className="px-4 py-2 border text-black tracking-tight" onClick={()=>{  router.push("/createworkflows")}} >Create workflow </button>
</div>
</div>


{workflows.map((wf) => (
  <div key={wf.wid} className="bg-gray-100 flex flex-col text-black p-4 gap-3 m-4 w-2xl border border-gray-500">
  <div>Workflow name: {wf.name}</div>
  <div>Date: {formatDate(wf.createdAt)}</div>
  <div>Status: {wf.isActive ? "Active" : "Not Active"}</div>
  </div>
))}









    </div>
)

}

export default WorkflowDashboardPage