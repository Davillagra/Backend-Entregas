import dotenv from "dotenv"
dotenv.config()


export const options = {
    mongoDB:{
        url:process.env.MONGO_URL
    },
    server:{
        port:process.env.PORT,
        secretSession: process.env.SECRET_SESSION
    },
    user: {
        adminPass:process.env.ADMIN_PASS,
        adminEmail:process.env.ADMIN_EMAIL
    },
    github:{
        id:process.env.GITHUB_ID,
        secret:process.env.GITHUB_SECRET,
        url:process.env.GITHUB_URL
    },
    bcrypt:{
        salt:process.env.BCRYPT_SALT
    }
}