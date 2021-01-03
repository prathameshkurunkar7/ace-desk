require('dotenv').config();

module.exports={
    "PORT": process.env.PORT,
    "DB_URL_LOCAL": process.env.DB_URL_LOCAL,
    "JWT_SECRET_KEY": process.env.JWT_SECRET_KEY
}