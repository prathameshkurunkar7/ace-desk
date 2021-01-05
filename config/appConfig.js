require('dotenv').config();

module.exports={
    "PORT": process.env.PORT,
    "DB_URL_LOCAL": process.env.DB_URL_LOCAL,
    "DB_URL_CLOUD":process.env.DB_URL_CLOUD,
    "JWT_SECRET_KEY": process.env.JWT_SECRET_KEY,
    "EMAIL_USERNAME":process.env.EMAIL_USERNAME,
    "EMAIL_PASSWORD":process.env.EMAIL_PASSWORD,
    "EMAIL_HOST":process.env.EMAIL_HOST,
    "EMAIL_PORT":process.env.EMAIL_PORT,
}