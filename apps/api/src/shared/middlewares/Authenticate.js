import Apperror from "../utils/Apperror";
import Securityutil from "../utils/Security";
const authenticate = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        throw new Apperror(401, "no token provided");
    }
    try {
        const decodedtoken = Securityutil.verifyToken(token);
        req.userID = decodedtoken.userId;
        next();
    }
    catch (error) {
        throw new Apperror(401, "Invalid or expired token");
    }
};
export default authenticate;
