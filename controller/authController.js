const userModel = require("../model/userSchema")
const emailValidator = require("email-validator")
const bcrypt = require('bcrypt')

const signup = async (req, res, next) => {

    const { name, email, password, confirmPassword } = req.body;
    console.log(name, email, password, confirmPassword);

    if (!name || !email || !password || !confirmPassword) {
        return res.status(400).json({
            success: false,
            message: "Every field is required"
        })
    }

    const validEmail = emailValidator.validate(email);
    if (!validEmail) {
        return res.status(400).json({
            success: false,
            message: "Please provide a valid email id"
        })
    }

    if (password !== confirmPassword) {
        return res.status(400).json({
            success: false,
            message: "password and confirm password doesn't match"
        })
    }

    try {
        const userInfo = userModel(req.body); // agar name same nahi rahega to modify karke bhena padega i.e usermodel({ })

        const result = await userInfo.save()

        return res.status(200).json({
            success: true,
            data: result
        })
    } catch (error) {
        if (error.code === 11000) {  // defined code 11000 for duplicate code
            return res.status(400).json({
                success: false,
                message: 'Account already exists with provided email id'
            })
        }
        return res.status(400).json({
            success: false,
            message: error.message
        })
    }


}

const signin = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: "Every field is mandatory"
        })
    }
    try {
        const user = await userModel
        .findOne({
            email
        })
        .select('+password') // itne sare chize hai pr mujhe kuch selected hi chiz chahiye. ye us email mein se ab password leke aayega

    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(400).json({
            success: false,
            message: "Invalid Credentials"
        })
    }

    // token genrate --> ek bar user ne login kar liya to wo is token se website ki functionality use karega ye cookie mein store hota hai
    // genrate token from jwt 3 part mein describe hota hai 1.konsa Algorithm use kar raha hu  2.konsa data rakhna chahta hu 3. konsa signature use karna chahte ho encryption ke liye 

    const token = user.jwtToken(); // user madhla token ghetla aahe
    user.password = undefined; // password dikhna nahi chahiye

    const cookieOption = {
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
        httpOnly: true // security purpose use hota hai or ye client side ki js se access nahi ho sakti
    };

    res.cookie("token", token, cookieOption);
    res.status(200).json({
        success: true,
        data: user // without password wala data
    })
        
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        })
    }
    
}

const getUser = async (req, res, next) => {
    const userId = req.user.id

    try {
        const user = await userModel.findById(userId);
        return res.status(200).json({
            success: true,
            data: user
        })
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        })
    }
}

const logout = (req, res) => {
        try {
            const cookieOption = {
                expires: new Date(),
                httpOnly: true
            }
            res.cookie("token", null, cookieOption);
            res.status(200).json({
                success: true,
                message: "Logged Out"
            })
        } catch (error) {
            return res.status(400).json({
                succes: false,
                message: error.message
            })
        }
}



module.exports = {
    signup,
    signin,
    getUser,
    logout,
}