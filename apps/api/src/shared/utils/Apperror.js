class Apperror extends Error {
    statuscode;
    constructor(statuscode, message) {
        super(message);
        this.statuscode = statuscode;
    }
}
export default Apperror;
