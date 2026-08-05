import { parseExpression } from "cron-parser"
import { ScheduleStatus } from "../../generated/prisma/client"
import prisma from "../../shared/utils/Prisma"
import { triggerdispatch } from "./triggerdispatch"

export const cronpoller = () => {
	const timer = setInterval(async () => {
		try {
			const dueschedules = await prisma.schedule.findMany({
				where: {
					schedulestatus: ScheduleStatus.ACTIVE,
					nextRunAt: {
						lte: new Date(),
					},
				},
			})

			for (const schedule of dueschedules) {
				try {
					await triggerdispatch(schedule)

					const interval = parseExpression(schedule.cron)
					const nextRunAt = interval.next().toDate()

					await prisma.schedule.update({
						where: { scheduleid: schedule.scheduleid },
						data: { nextRunAt: nextRunAt },
					})
				} catch (scheduleError) {
					console.error(
						`Scheduler error dispatching schedule ${schedule.scheduleid}:`,
						scheduleError,
					)
				}
			}
		} catch (error) {
			console.error("Scheduler polling error:", error)
		}
	}, 60 * 1000)

	return () => clearInterval(timer)
}
