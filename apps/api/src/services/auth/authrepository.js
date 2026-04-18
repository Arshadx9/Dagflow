import prisma from "../../shared/utils/Prisma";
export const findbyusername = async (username) => {
    return await prisma.bizowner.findUnique({
        where: { username: username }
    });
};
export const createaccount = async (username, hashedpassword) => {
    return await prisma.bizowner.create({
        data: {
            username: username,
            password: hashedpassword,
            hasOnboarded: false
        }
    });
};
export const createapikey = async (genapikey, ownerId) => {
    return await prisma.apiKey.create({
        data: {
            theapikey: genapikey,
            bizid: ownerId
        }
    });
};
export const findapibyownerid = async (ownerId) => {
    return await prisma.apiKey.findFirst({
        where: { bizid: ownerId }
    });
};
export const findapibyapi = async (apikey) => {
    return await prisma.apiKey.findFirst({
        where: {
            theapikey: apikey
        }
    });
};
export const sethasonboarded = async (userId) => {
    return await prisma.bizowner.update({
        where: {
            ownerId: userId
        },
        data: {
            hasOnboarded: true
        }
    });
};
