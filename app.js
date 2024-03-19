const express = require('express');
const app = express();
const authRouter = require('./router/authRoute')
const databaseconnect = require('./config/db')
const cookieParser = require('cookie-parser')
const cors = require('cors'); // dusre domain se access karne ke liye use hota hai
databaseconnect();

app.use(express.json())
app.use(cookieParser());  // Router mein jane se pahle yaha se verify hoga
app.use(cors({
    origin: [process.env.CLIENT_URL],
    credentials: true
}))   // ye root level ke liye hai ek or tarika hota hai custome route se

app.use('/api/auth/', authRouter) // jitne bhi auth wo prefix ho kisi path se jitne bhi request ispe aayegi to authRoute pe jayegi.

app.use('/', (req, res) => {
    res.status(200).json({ data: "JWTauth server is updated"});
})


module.exports = app;