import { Schema, model } from 'mongoose';
import crypto from 'crypto';

// user Schema
const UserSchema = new Schema({
    name: {
        type: String,
        trim: true,
        required: true
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        required: true,
        unique: true,
    },
    hashed_password: {
        type: String,
        required: true
    },
    salt: String,
    role: {
        type: String,
        default: 'subscriber'
    },
    resetPasswordLink: {
        data: String,
        default: '',
    },
    register_date: {
        type: Date,
        default: Date.now()
    }
}, { timestamps: true });



//Virtual field
UserSchema
    .virtual('password')
    .set(function (password) {
        this._password = password
        this.salt = this.makeSalt()
        this.hashed_password = this.encryptPassword(password)
    })
    .get(function () {
        return this._password
    })

//methods
UserSchema.methods = {
    authenticate: function (plainPassword) {
        return this.encryptPassword(plainPassword) === this.hashed_password  //true or false
    },
    encryptPassword: function (password) {
        if (!password) return '';
        try {
            return crypto.createHmac('sha1', this.salt)
                .update(password)
                .digest('hex');
        } catch (err) {
            return '';
        }
    },
    makeSalt: function () {
        return Math.round(new Date().valueOf() * Math.random()) + '';
    }
}


export const User = model('User', UserSchema)
