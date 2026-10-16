import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'name is required']
    },
    email: {
        type: String,
        required: [true, 'email is required'],
        unique: true
    },
    emailValidated: {
        type: Boolean,
        default: false
    },
    password: {
        type: String,
        required: [true, 'password is required'],

    },
    img: String,
    role: {
        type: [String],
        default: ['USER_ROLE'],
        required: [true, 'role is required']
    }
})

export const UserModel = mongoose.model('User', UserSchema);