import { Schema, model } from "mongoose"

const schema = new Schema(
    {
        price: {type:Number, required: true},
        discount: {type:Number, required: true},
        link: {type:String, required:false},
        state: {type:String, required:false},
        lga: {type:String, required:false},
        city: {type:String, required:false},
        address: {type:String, required:false},
        phone: {type:String, required:false},
        whatsapp: {type:String, required:false},
        website: {type:String, required:false},
        image: [],
        description: {type:String, required:true},
        startDate: {type:Date, required:true},
        endDate: {type:Date, required:true},
        startTime: {type:Date, required:true},
        endTime: {type:Date, required:true},
        category: {type:String, required:true},
        temp: {type:Number, required: true},
        approved:{type:Boolean, required:true, default:false},
    }
)

export const Product = model('Promo',schema)