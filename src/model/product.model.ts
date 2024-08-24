import { Schema, model } from "mongoose";

// Enum for ReviewState
export enum ReviewState {
    "True" = "true",
    "False" = "false",
    "Pending" = "pending"
}

// Define the schema for Promo
const schema = new Schema(
    {
        price: { type: Number, required: true },
        discount: { type: Number, required: true },
        link: { type: String, required: false },
        state: { type: String, required: false },
        lga: { type: String, required: false },
        city: { type: String, required: false },
        address: { type: String, required: false },
        phone: { type: String, required: false },
        whatsapp: { type: String, required: false },
        website: { type: String, required: false },
        images: {type: Array, required: true},
        description: { type: String, required: true },
        startDate: { type: Date, required: true },
        endDate: { type: Date, required: true },
        startTime: { type: Date, required: true },
        endTime: { type: Date, required: true },
        category: { type: String, required: true },
        temp: { type: Number, required: false, default: 10 },
        promoId:{type: String, required: true},
        approved: { 
            type: String, 
            enum: Object.values(ReviewState), 
            required: true, 
            default: ReviewState.Pending 
        },
        createdBy: { 
            type: Schema.Types.ObjectId, 
        ref: 'User',  // Reference to the User model
        required: true 
        } // Reference to the User model
    },
    { timestamps: true } // Adds createdAt and updatedAt fields
)

// Export the Product model
export const Product = model('Promo', schema);
