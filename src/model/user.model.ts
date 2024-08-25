import { Schema, model } from "mongoose";

enum UserType {
    Admin = "admin",
    User = "user"
}

const schema = new Schema(
    { 
        username: { type: String, required: false },
        email: { type: String, required: true },
        password: { type: String, required: true },
        image: { type: String, required: true, default: "https://img.icons8.com/material-rounded/100/user.png" },
        isVerified: { type: Boolean, required: true, default: false },
        role: { type: String, enum: Object.values(UserType), required: true, default: UserType.User },
        state:{type: String, required: false},
        lga:{type: String, required: false},
        city:{type: String, required:false},
        contact:{type: String,required:false},
        address:{type: String, required:false},
        link:{type: String, required:false},
        name:{type: String, required:false},
        phone:{type: String, required:false},
    },
    { timestamps: true } // Adds createdAt and updatedAt fields
);

export const User = model('User', schema);
