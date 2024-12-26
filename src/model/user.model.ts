import { Schema, model } from "mongoose";

const schema = new Schema(
    { 
        username: { type: String, required: false },
        email: { type: String, required: true },
        password: { type: String, required: true },
      
    },
    { timestamps: true } // Adds createdAt and updatedAt fields
);

export const User = model('User', schema);
