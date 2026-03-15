import dotenv from "dotenv"

dotenv.config

const config = {
      
   jwt: {
        secret: ( process.env.JWT_SECRET || "SABKA_VALINTINE_WEEK_KAISE_JA_RAHA_HAI") as string ,
        expiresIn: (process.env.JWT_EXPIRES_IN  || '24h')as string,
   }


}
export default config 