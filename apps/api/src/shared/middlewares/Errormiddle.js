import Apperror from "../utils/Apperror";
import Responseformatter from "../utils/Responseformatter";
const Errorhandler = (err, req, res, next) => {
    if (err instanceof Apperror) {
        var message = err.message;
        var statuscode = err.statuscode;
        res.status(statuscode).json(Responseformatter.error(message));
    }
    else {
        res.status(500).json(Responseformatter.error("there was an error"));
    }
};
export default Errorhandler;
