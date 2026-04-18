class Responseformatter {
    static success(message, data = null) {
        return {
            success: true,
            data: data,
            message: message
        };
    }
    static error(data = null) {
        return {
            success: false,
            data: data
        };
    }
}
export default Responseformatter;
