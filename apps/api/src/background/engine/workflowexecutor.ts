import { stepexecutor } from "./stepexecutor"

type JobData = {
	stepRunId: string
	jobRunId: string
	stepId: string
	stepConfig: any
	workflowId?: string
	versionId?: string
	workflowid?: string
	versionid?: string
}

export const workflowexecutor = async (jobData: JobData) => {
	await stepexecutor(jobData)
}
