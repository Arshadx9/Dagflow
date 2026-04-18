export const QUEUE_NAME = "step-execution"

export const defaultjobs = {
	attempts: 1,
	backoff: {
		type: "exponential" as const,
		delay: 2000,
	},
}
