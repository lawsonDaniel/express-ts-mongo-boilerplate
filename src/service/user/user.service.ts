import { AnyPtrRecord } from "dns";
import { Product, ReviewState } from "../../model/product.model";
import { generateAlphaNumericCodes, uploadBase64Image } from "../../util/upload";
import mongoose from "mongoose";

class userServiceClass {
    public filter = async (filter: any, _id: string, page: number = 1, limit: number = 10) => {
        try {
            const query: any = {};
    
            // Filtering by approved
            if (filter.approved !== undefined) {
                query.approved = filter.approved;
            }
    
            // Filtering by createdBy
            if (_id) {
                query.createdBy = _id;
            }
    
            // Filtering by expired
            if (query.expired) {
                const currentDate = new Date();
                query.endDate = { $gt: currentDate };
                query.endTime = { $gt: currentDate };
            }
    
            // Calculate the skip value for pagination
            const skip = (page - 1) * limit;
    
            // Execute the query with pagination
            const response = await Product.find(query)
                .populate('createdBy')
                .skip(skip)
                .limit(limit);
    
            // Get the total count of documents for pagination
            const totalCount = await Product.countDocuments(query);
    
            return {
                message: 'Filter applied successfully',
                status: 200,
                data: response,
                pagination: {
                    totalItems: totalCount,
                    currentPage: page,
                    totalPages: Math.ceil(totalCount / limit),
                    pageSize: limit
                }
            };
        } catch (err) {
            return {
                message: err || 'An error occurred',
                status: 500
            };
        }
    }
    
    
    public getPromoCount = async (id: string) => {
        try {
            const objectId = id;
            console.log("objectId", objectId, id);
    
            // Use Promise.all to concurrently execute countDocuments queries
            const [
                totalProducts,
                totalUnderReview,
                totalApproved,
                totalDeclined,
                totalExpired,
            ] = await Promise.all([
                Product.countDocuments({ createdBy: objectId}), // Count total products created by the user
                Product.countDocuments({
                    approved: ReviewState.Pending, // Products under review
                    createdBy: objectId,
                }),
                Product.countDocuments({
                    approved: ReviewState.True, // Approved products
                    createdBy: objectId,
                }),
                Product.countDocuments({
                    approved: ReviewState.False, // Declined products
                    createdBy: objectId,
                }),
                Product.countDocuments({
                    endDate: { $lt: new Date() }, // Expired products
                    createdBy: objectId,
                }),
            ]);
    
            return {
                message: "Dashboard information successfully generated",
                status: 200,
                data: {
                    totalProducts,
                    totalUnderReview,
                    totalApproved,
                    totalDeclined,
                    totalExpired,
                }
            };
        } catch (err) {
            return {
                message: err || 'Internal Server Error',
                status: 500
            };
        }
    }

   public createPromo = async (data: any, id: string) => {
        try {
            const { images } = data;
            const promoId = generateAlphaNumericCodes();
    
            // Validate that `images` is an array and has valid items
            if (!Array.isArray(images) || images.length === 0) {
                throw new Error('No images provided');
            }
    
            // Use Promise.all to upload all images concurrently
            const uploadPromises = images.map((base64Image: any) => {
                if (base64Image) {
                    return uploadBase64Image(base64Image?.img, promoId[0]);
                } else {
                    throw new Error('Invalid image data');
                }
            });
    
            const results = await Promise.all(uploadPromises);
    
            // Remove the images property from data after processing
            delete data.images;
            delete data?.createdBy
            // Extract URLs from the upload results
            const promoImages = results.map((img) => img?.secure_url);
    
            console.log("Uploaded images", promoImages);
    
            // Create the new promo document in the database
            const newPromo = await Product.create({
                images: promoImages,
                promoId: promoId[0],
                createdBy: id, // Correctly saving createdBy as an ObjectId
                ...data
            });
    
            return {
                message: "Promo created successfully",
                data: newPromo,
                status: 201
            };
    
        } catch (err:any) {
            console.error("Error creating promo:", err); // Log the error for debugging
            return {
                message: err.message || "An error occurred",
                status: 500
            };
        }
    };
}

const userService = new userServiceClass();
export default userService;