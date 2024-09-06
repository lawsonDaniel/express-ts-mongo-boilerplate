import { Schema, model } from "mongoose";

const schema = new Schema({
    user: { 
        type: Schema.Types.ObjectId, 
    ref: 'User',  // Reference to the User model
    required: true 
    },
    Promo: { 
        type: Schema.Types.ObjectId, 
    ref: 'Promo',  // Reference to the User model
    required: true 
    },
    approvedBy:{ 
        type: Schema.Types.ObjectId, 
    ref: 'User',  // Reference to the User model
    required: true 
    }
   
},
{ timestamps: true } // Adds createdAt and updatedAt fields
)
export const Notifications = model('Notifications',schema)