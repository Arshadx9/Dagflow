import { Status } from "@prisma/client"
import { executeHttpStep } from "../handlers/httpStepHandler"
import prisma from "../../shared/utils/Prisma"
import { dagresolve } from "./dagresolver"
import { handleretry } from "./handleretry"
import {
	UpdateStepError,
	UpdateStepRunOutput,
	UpdateStepRunStatus,
} from "./statemanager"

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

export const stepexecutor = async (jobdata: jobdata) => {
	try {
		await UpdateStepRunStatus(jobdata.stepRunId, Status.RUNNING)

		const result = await executeHttpStep(jobdata.stepConfig)
		if (result) {
			await UpdateStepRunOutput(jobdata.stepRunId, result)

			const workflowId = jobdata.workflowId ?? jobdata.workflowid
			const versionId = jobdata.versionId ?? jobdata.versionid

			if (workflowId && versionId) {
				await dagresolve(versionId, jobdata.jobRunId, workflowId)
			}
		}
	} catch (error) {
		await UpdateStepRunStatus(jobdata.stepRunId, Status.FAILED)
		await UpdateStepError(jobdata.stepRunId, "failed")

		const stepRun = await prisma.stepRun.findFirst({
			where: { steprunid: jobdata.stepRunId },
		})

		const currentRetries = stepRun?.retries || 0

		await handleretry(currentRetries, jobdata)
	}
}
