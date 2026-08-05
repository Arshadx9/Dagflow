export const QUEUE_NAME = "step-execution"

export const defaultjobs = {
	attempts: 3,
	backoff: {
		type: "exponential" as const,
		delay: 2000,
	},
}
