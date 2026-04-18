import { Queue } from "bullmq"
import { Status, type Schedule } from "@prisma/client"
import redisConnection from "../../shared/config/redis"
import prisma from "../../shared/utils/Prisma"

export const triggerdispatch = async (schedule: Schedule) => {
	const version = await prisma.workflowVersion.findFirst({
		where: {
			wfmid: schedule.workflowid,
		},
		orderBy: {
			versionNumber: "desc",
		},
	})

	if (!version) {
		return
	}

	const jobinfo = await prisma.jobRun.create({
		data: {
			workflowid: schedule.workflowid,
			versionid: version.versionid,
			data: {},
			status: Status.PENDING,
		},
	})

	const steps = version?.steps as any[]
	const steprunmap: any = {}

	for (const step of steps) {
		const stepRun = await prisma.stepRun.create({
			data: {
				jobid: jobinfo.jobid,
				stepid: step.id,
				status: Status.PENDING,
				retries: 0,
			},
		})
		steprunmap[step.id] = stepRun.steprunid
	}

	const unblckedsteps = steps.filter((step) => step.dependsOn.length === 0)
	const stepQueue = new Queue("step-execution", { connection: redisConnection })

	for (const step of unblckedsteps) {
		await stepQueue.add("execute-step", {
			jobRunId: jobinfo.jobid,
			stepRunId: steprunmap[step.id],
			stepId: step.id,
			stepConfig: step.config,
			workflowId: schedule.workflowid,
			versionId: version.versionid,
		})
	}
}
