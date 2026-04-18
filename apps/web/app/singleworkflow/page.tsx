"use client";
import axios from "axios";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

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

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

const SingleWorkflowPage = ({ params }: { params: { id: string } }) => {
  const router = useRouter();
  const [workflow, setWorkflow] = useState<Workflow | null>(null);

  useEffect(() => {
    const fetchWorkflow = async () => {
      const response = await api.get(`/getworkflowbyid${params.id}`);
      setWorkflow(response.data.data.workflow);
    };
    fetchWorkflow();
  }, [params.id]);

  if (!workflow) return <div className="p-8 text-black">Loading...</div>;

  const latestVersion = workflow.wfv?.sort((a, b) => b.versionNumber - a.versionNumber)[0];

  return (
    <div className="h-screen bg-gray-50 p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-black text-xl">{workflow.name}</h1>
        <button onClick={() => router.push("/workflows")} className="px-4 py-2 border border-gray-500 text-black">
          Back
        </button>
      </div>

      <div className="flex flex-col gap-3">
        {latestVersion?.steps?.map((step) => (
          <div key={step.id} className="bg-gray-100 border border-gray-500 p-3">
            <p className="text-black text-sm">{step.id}</p>
            <p className="text-black text-sm">Depends on: {step.dependsOn?.length > 0 ? step.dependsOn.join(", ") : "nothing"}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SingleWorkflowPage;