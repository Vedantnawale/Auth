const mongoose = require('mongoose');

const MONGODB_URL = process.env.MONGODB_URL || "mongodb://0.0.0.0:27017/auth"  // default to mongodb pe setup ho jayega agar third party pe nahi kiya hai to. process.env run time pe access kar sakte hai

const databaseconnect = () => {
    mongoose
    .connect(MONGODB_URL)
    .then((conn) => console.log(`Connected to DB: ${conn.connection.host}`))
    .catch((err) => console.log(err.message))
}

module.exports = databaseconnect;