import dotenv from "dotenv"

dotenv.config()

const config = {
      
   jwt: {
        secret: ( process.env.JWT_SECRET || "SABKA_VALINTINE_WEEK_KAISE_JA_RAHA_HAI") as string ,
        expiresIn: (process.env.JWT_EXPIRES_IN  || '24h')as string,
   },
   cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        expiresIn: 24 * 60 * 60 * 1000
    }


}
export default config 