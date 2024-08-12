import { Schema, model } from "mongoose";

const schema = new Schema(
    {
        title:{type:String, required:true},
        offerType:{type:String, required:true},
        price:{type:Number, required:true},
        promoPrice:{type:Number, required:true},
        availability:{type:String, required:true},
        image:{type:Array, required:true},
        description:{type:String, required:true},
        start:{type:Date, required:true},
        end:{type:Date, required:true},
        expires:{type:Date, required:true},
        postedBy:{type:Schema.Types.UUID, required:true},
        approved:{type:Boolean, required:true, default:false},
    }
)

export const Product = model('Product',schema)