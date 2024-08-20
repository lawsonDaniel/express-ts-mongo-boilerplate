import { Schema, model } from "mongoose";

const schema = new Schema({
    banner1:{type:String, required:true},
    banner2:{type:String, required:true},
    banner3:{type:String, required:true},
    banner4:{type:String, required:true},
    banner5:{type:String, required:true},
    banner6:{type:String, required:true},
    banner7:{type:String, required:true},
    banner8:{type:String, required:true},
    banner9:{type:String, required:true},
   
},
{ timestamps: true } // Adds createdAt and updatedAt fields
)
export const Banner = model('Banner',schema)