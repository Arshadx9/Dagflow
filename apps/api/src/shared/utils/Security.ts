import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import config from "../config"



class Securityutil {

static async hashPassword ( password : string){

    const hashedpassword = await bcrypt.hash(password ,10)
    return hashedpassword

}

static async comparePassword (password  : string , hashedpassword : string) {
    const result = await  bcrypt.compare(password  , hashedpassword)
    return result 
}

static generateToken (payload : object){
    const token = jwt.sign(payload , config.jwt.secret, {expiresIn : "1d"})
    return token 

} 

static  verifyToken(token : string){

const decodedobject = jwt.verify(token, config.jwt.secret )

return decodedobject

}


}

export default Securityutil