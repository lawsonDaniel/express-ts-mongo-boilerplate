import { Schema,model } from "mongoose";

const schema = new Schema(
    { 
        email:{type: String, required: true},
        password:{type: String, required: true},
        image:{type:String, required: true,default:"https://picsum.photos/60/60"},
        isVerified:{type: Boolean, required: true,default: false},
     }
);
export const User = model('User', schema)