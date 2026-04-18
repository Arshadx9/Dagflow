import axios from "axios";
export const executeHttpStep = async (config) => {
    const response = await axios({
        url: config.url,
        method: config.method,
        data: config.body,
        headers: config.headers,
    });
    return response.data;
};
