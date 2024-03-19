const mongoose = require('mongoose');
const { Schema } = mongoose;
const JWT = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const userSchema = new Schema({
    name: {
        type: String,
        required: [true, 'user name is Required'],
        minLength: [5, 'Name must be at least 5 char'],
        maxLength: [50, 'Name must be less than 50 char'],
        trim: true // agar user ne aage piche kcuh khali spaces chhode hai to wo count nahi karta
    },
    email: {
        type: String,
        required: [true, 'user email is Required'],
        unique: [true, 'email already registered'],
        lowercase: true,
    },
    password:{
        type: String,
        select: false,
        minLength: [8, 'Name must be at least 8 char'],
        maxLength: [16, 'Name must be less than 16 char'],
    },
    forgotPasswordToken: {
        type: String
    },
    forgotPasswordExpiryDate: {
        type: Date
    }
}, {
    timestamps: true
});

userSchema.pre('save', async function(next) {
    if(!this.isModified('password')){
        return next();
    }
    this.password = await bcrypt.hash(this.password, 10);
    return next();
})

userSchema.methods = {
    jwtToken() {
        return JWT.sign({
            id: this._id,
            email: this._email
        }, process.env.SECRET,
        { expiresIn: '24h' })
    }
}  // he mongoose ch feature aahe tyat aapan custom schema method banvu shakto

const userModel = mongoose.model('user', userSchema)
module.exports = userModel