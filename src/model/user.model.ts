import { Schema, model } from "mongoose";

enum UserType {
    Admin = "admin",
    User = "user"
}

const schema = new Schema(
    { 
        email: { type: String, required: true },
        password: { type: String, required: true },
        image: { type: String, required: true, default: "https://picsum.photos/60/60" },
        isVerified: { type: Boolean, required: true, default: false },
        role: { type: String, enum: Object.values(UserType), required: true, default: UserType.User }
    }
);

export const User = model('User', schema);
