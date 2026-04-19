"use client";
import axios from "axios";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

type Step = {
  id: string;
  dependsOn: string[];
};

type Version = {
  versionNumber: number;
  steps: Step[];
};

type Workflow = {
  name: string;
  wfv: Version[];
};

type StepRun = {
  steprunid: string;
  stepid: string;
  status: string;
  error?: string;
};

type JobRun = {
  jobid: string;
  status: string;
  createdAt: string;
  steprun: StepRun[];
};

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

const statusColor = (status: string) => {
  switch (status) {
    case "FINISHED": return "bg-green-100 text-green-800";
    case "RUNNING": return "bg-blue-100 text-blue-800";
    case "FAILED": return "bg-red-100 text-red-800";
    case "PENDING": return "bg-yellow-100 text-yellow-800";
    default: return "bg-gray-100 text-gray-800";
  }
};

const SingleWorkflowContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const [workflow, setWorkflow] = useState<Workflow | null>(null);
  const [runs, setRuns] = useState<JobRun[]>([]);
  const [expandedRun, setExpandedRun] = useState<string | null>(null);

 

 
  useEffect(() => {
    if (!id) return;
     const fetchWorkflow = async () => {
    if (!id) return;
    const response = await api.get(`/api/workflow/getworkflowbyid/${id}`);
    setWorkflow(response.data.data.workflows);
  };
   const fetchRuns = async () => {
    if (!id) return;
    const response = await api.get(`/api/run/${id}/getallrunsforthisworkflow`);
    setRuns(response.data.data);
  };

    fetchWorkflow();
    fetchRuns();
    const interval = setInterval(fetchRuns, 3000);
    return () => clearInterval(interval);
  }, [id]);

  if (!workflow) return <div className="p-8 text-black">Loading...</div>;

  const latestVersion = workflow.wfv?.sort((a, b) => b.versionNumber - a.versionNumber)[0];

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-black text-2xl font-bold">{workflow.name}</h1>
        <button onClick={() => router.push("/workflowsdashboard")} className="px-4 py-2 border border-gray-500 text-black">
          Back
        </button>
      </div>

      <h2 className="text-black text-lg font-semibold mb-3">Steps</h2>
      <div className="flex flex-col gap-3 mb-10">
        {latestVersion?.steps?.map((step) => (
          <div key={step.id} className="bg-white border border-gray-300 p-3 rounded">
            <p className="text-black text-sm font-medium">{step.id}</p>
            <p className="text-gray-500 text-sm">Depends on: {step.dependsOn?.length > 0 ? step.dependsOn.join(", ") : "nothing"}</p>
          </div>
        ))}
      </div>

     
      <h2 className="text-black text-lg font-semibold mb-3">Job Runs</h2>
      {runs.length === 0 && <p className="text-gray-500 text-sm">No runs yet.</p>}
      <div className="flex flex-col gap-4">
        {runs.map((run) => (
          <div key={run.jobid} className="bg-white border border-gray-300 rounded p-4">
            <div
              className="flex justify-between items-center cursor-pointer"
              onClick={() => setExpandedRun(expandedRun === run.jobid ? null : run.jobid)}
            >
              <div className="flex flex-col gap-1">
                <p className="text-black text-sm font-mono">{run.jobid}</p>
                <p className="text-gray-500 text-xs">{new Date(run.createdAt).toLocaleString()}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColor(run.status)}`}>
                {run.status}
              </span>
            </div>

            {expandedRun === run.jobid && (
              <div className="mt-4 flex flex-col gap-2">
                <p className="text-black text-sm font-semibold">Step Runs:</p>
                {run.steprun?.map((sr) => (
                  <div key={sr.steprunid} className="flex justify-between items-center bg-gray-50 border border-gray-200 p-2 rounded">
                    <p className="text-black text-sm">{sr.stepid}</p>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColor(sr.status)}`}>
                      {sr.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const SingleWorkflowPage = () => {
  return (
    <Suspense fallback={<div className="p-8 text-black">Loading...</div>}>
      <SingleWorkflowContent />
    </Suspense>
  );
};

export default SingleWorkflowPage;