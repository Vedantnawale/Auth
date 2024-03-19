const JWT = require("jsonwebtoken")

const jwtAuth = (req, res, next) => {
    const token = (req.cookies && req.cookies.token) || null  // ye cookies ko json mein karna padta hai to cookie-parser mein convert hoga jo app mein declare kiya hai 

    if(!token){
        return res.status(400).json({
            success: false,
            message: 'Not authorized'
        })
    }

    try {
        const payload = JWT.verify(token, process.env.SECRET);
        req.user = { id: payload.id, email: payload.email };
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        })
    }

    next(); // aap ek process se dusre se tisre ja sakte one at a time
}

module.exports = jwtAuth