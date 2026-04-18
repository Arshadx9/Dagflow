"use client"
import { useState } from "react"
import axios from "axios";
import { useRouter } from "next/navigation";

type Step = {
  id: string
  type: "http" 
  dependsOn: string[]
}

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

const CreateWorkflowsPage = () => {
const router = useRouter();

  const [wfname, setWfname] = useState("")
const [steps, setSteps] = useState<Step[]>([])
const [error, setError] = useState<string | null>(null)

const addstep = () => {
  const newstep : Step = {
id  :`step-${steps.length + 1}`,
type : "http",
dependsOn : []
  }
  setSteps([...steps , newstep])
}

  const updateStepDependsOn = (id: string, value: string) => {
    setSteps(
      steps.map((step) =>
        step.id === id
          ? {
              ...step,
              dependsOn: value
                .split(",")
                .map((s) => s.trim())
                .filter(Boolean),
            }
          : step
      )
    );
  };

  const handleSubmit = async () => {
    try {
      setError(null);
      await api.post("/api/workflow/createworkflow", { 
        name: wfname, 
        steps: steps.map(step => ({
          id: step.id,
          name: step.id,
          dependsOn: step.dependsOn
        }))
      });
      router.push("/workflowsdashboard");
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Failed to create workflow");
      } else {
        setError("Something went wrong");
      }
    }
  };

	return (
	    <div className="min-h-dvh bg-gray-50 flex flex-col justify-center items-center">

	<div className=" p-6 text-black">
			<h1 className="font-helvetica text-5xl tracking-tight">Create your Workflow</h1>
		</div>

        <div className="flex flex-col  justify-center items-center gap-3.5"  >
              <label className="text-black text-sm">Workflow Name</label>
<input type="text" placeholder="eg : process order"  className="border text-black p-2 font-helvetica tracking-tighter w-2xl"
            value={wfname} onChange={(e)=>{setWfname(e.target.value)}}
/>
<button  className="px-4 py-2 border text-black tracking-tight font-helvetica w-2xl" onClick={addstep} >
    Add step 
</button>
</div>

{error && <div className="text-red-500 mt-2">{error}</div>}

<div className="flex flex-col gap-3 mt-6">
          {steps.map((step) => (
            <div
              key={step.id}
              className="flex items-center gap-4 border border-black p-3"
            >
              <span className="text-black text-sm font-helvetica">{step.id}</span>
              <input
                type="text"
                placeholder="depends on (e.g. step-1, step-2)"
                onChange={(e) => updateStepDependsOn(step.id, e.target.value)}
                className="border border-black bg-white p-2 text-black text-sm w-64 font-helvetica"
              />
            </div>
          ))}
        </div>

<div className="flex  justify-center items-center gap-3.5 mt-4">
<button  className="px-4 py-2 border-2 text-black tracking-tight font-helvetica "   onClick={handleSubmit} >
  submit
</button>
<button  className="px-4 py-2 border-2 text-black tracking-tight font-helvetica" 
    onClick={() => router.push("/workflowsdashboard")}
 >
 cancel 
</button>
</div>

        </div>
	)
}

export default CreateWorkflowsPage