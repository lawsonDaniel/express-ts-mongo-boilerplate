import { AnyPtrRecord } from "dns";
import { Product, ReviewState } from "../../model/product.model";
import { generateAlphaNumericCodes, uploadBase64Image } from "../../util/upload";

class userServiceClass {
    public filter = async (filter: any,_id:string) => {
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
    
           if(query.expired){
             // Filtering by endDate greater than the current date
             const currentDate = new Date();
             query.endDate = { $gt: currentDate };
     
             // Filtering by endTime greater than the current time
             query.endTime = { $gt: currentDate };
             console.log("query",query)
           }
            const response = await Product.find(query).populate('createdBy');
    
            return {
                message: 'Filter applied successfully',
                status: 200,
                data: response
            };
        } catch (err) {
            return {
                message: err || 'An error occurred',
                status: 500
            };
        }
    }
    
    public getPromoCount = async(id:string)=>{
        try{
              // Await all countDocuments promises
      const totalProducts = await Product.countDocuments({createdBy:id});
      const totalUnderReview = await Product.countDocuments({
        approved: ReviewState.Pending,
        createdBy:id
    });
      const totalApproved = await Product.countDocuments({
         approved: ReviewState.True,
         createdBy:id
         });
      const totalDeclined = await Product.countDocuments({
         approved: ReviewState.False,
         createdBy:id
         });
         const currentDate = new Date();

    const totalExpired = await Product.countDocuments({
        endDate:{ $gt: currentDate }
    })
      return {
        message: "Dashboard information successfully generated",
        status: 200,
        data: {
          totalUnderReview,
          totalProducts,
          totalApproved,
          totalDeclined,
          totalExpired
        }
      };
        }catch(err){
            return {
                message:err,
                status:500
            }
        }
    }
    public createPromo = async (data: any, id: string) => {
        try {
            const { images } = data;
            const promoId = generateAlphaNumericCodes();
    
            // Use Promise.all to upload all images concurrently
            const uploadPromises = images.map((base64Image: any) => {
                return uploadBase64Image(base64Image, promoId[0]);
            });
    
            const results = await Promise.all(uploadPromises);
            
            // Set the images property to null and then delete it
            delete data.images;
            const promoImages = results.map((img)=>{
               return img?.secure_url 
            })
            console.log("uploaded images",promoImages)
            const newPromo = await Product.create({
                images: promoImages,
                promoId: promoId[0],
                createdBy:id,
                ...data
            });
    
            return newPromo; // Return the newly created promo
        } catch (err) {
            return {
                message: err || "An error occurred",
                status: 500
            };
        }
    };
    
}

const userService = new userServiceClass();
export default userService;