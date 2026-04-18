import Apperror from "../../shared/utils/Apperror";
import { createaccount, createapikey, findbyusername, sethasonboarded, findapibyownerid } from "./authrepository";
import Securityutil from "../../shared/utils/Security";
import crypto from "crypto";
import { Prisma } from "../../shared/utils/Prisma";
export const authregister = async (enteredname, enteredpass) => {
    try {
        const existinguser = await findbyusername(enteredname);
        if (existinguser) {
            throw new Apperror(400, "the name is already taken");
        }
        const hashedpass = await Securityutil.hashPassword(enteredpass);
        const newuser = await createaccount(enteredname, hashedpass);
        const generatedapi = `grd_${crypto.randomBytes(32).toString('hex')}`;
        const apiKey = await createapikey(generatedapi, newuser.ownerId);
        const generatedtoken = Securityutil.generateToken({ userId: newuser.ownerId });
        return {
            api: apiKey,
            user: newuser,
            token: generatedtoken
        };
    }
    catch (error) {
        if (error instanceof Apperror) {
            throw error;
        }
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === "P2002") {
                throw new Apperror(400, "the name is already taken");
            }
        }
        throw error;
    }
};
export const authlogin = async (enteredname, enteredpass) => {
    const existinguser = await findbyusername(enteredname);
    if (!existinguser) {
        throw new Apperror(401, "something went wrong");
    }
    const isMatch = await Securityutil.comparePassword(enteredpass, existinguser.password);
    if (!isMatch) {
        throw new Apperror(401, "Invalid credentials");
    }
    const generatedtoken = Securityutil.generateToken({ userId: existinguser.ownerId });
    const { password: _password, ...safeUser } = existinguser;
    return {
        user: safeUser,
        token: generatedtoken
    };
};
export const onboarding = async (ownerid) => {
    const theapikey = await findapibyownerid(ownerid);
    await sethasonboarded(ownerid);
    return theapikey;
};
