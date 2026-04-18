import axios from "axios"

type HttpConfig = {
	url: string
	method: "GET" | "POST" | "PUT" | "DELETE"
	body?: any
	headers?: any
}

export const executeHttpStep = async (config: HttpConfig) => {
	const response = await axios({
		url: config.url,
		method: config.method,
		data: config.body,
		headers: config.headers,
	})

	return response.data
}
