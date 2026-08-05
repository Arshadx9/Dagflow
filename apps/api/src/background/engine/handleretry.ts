import { Status } from "../../generated/prisma/client"
import { defaultjobs } from "../queue/queueconfig"
import { pushtoqueue } from "../queue/producer"
import { Jobrunendtime, JobRunStatus, UpdateStepRunStatus } from "./statemanager"
import prisma from "../../shared/utils/Prisma"

type jobdata = {
	stepRunId: string
	jobRunId: string
	stepId: string
	stepConfig: any
	workflowId?: string
	versionId?: string
	workflowid?: string
	versionid?: string
}

export const handleretry = async (currenRetries: number, jobdata: jobdata) => {
	let maxRetries = defaultjobs.attempts

	if (currenRetries < maxRetries) {
		await prisma.stepRun.update({
			where: { steprunid: jobdata.stepRunId },
			data: {
				retries: { increment: 1 },
				status: Status.RETRYING,
			},
		})

		await pushtoqueue(jobdata)
		return
	} else {
		await UpdateStepRunStatus(jobdata.stepRunId, Status.FAILED)
		await JobRunStatus(jobdata.jobRunId, Status.FAILED)
		await Jobrunendtime(jobdata.jobRunId)
	}
}
