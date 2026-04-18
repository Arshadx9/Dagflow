import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import config from "../config";
class Securityutil {
    static async hashPassword(password) {
        const hashedpassword = await bcrypt.hash(password, 10);
        return hashedpassword;
    }
    static async comparePassword(password, hashedpassword) {
        const result = await bcrypt.compare(password, hashedpassword);
        return result;
    }
    static generateToken(payload) {
        const token = jwt.sign(payload, config.jwt.secret, { expiresIn: "1d" });
        return token;
    }
    static verifyToken(token) {
        return jwt.verify(token, config.jwt.secret);
    }
}
export default Securityutil;
