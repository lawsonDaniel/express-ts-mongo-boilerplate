import { UploadApiResponse } from "cloudinary";
import { Banner } from "../../model/banner.model";
import { Product, ReviewState } from "../../model/product.model";
import { User } from "../../model/user.model";
import { uploadBase64Image } from "../../util/upload";
import { Notifications } from "../../model/Notification.model";

interface ProductQueryParams {
  approved?:boolean
}
class AdminService {
  public getDashboardDetails = async () => {
    try {
      // Await all countDocuments promises
      const totalUsers = await User.countDocuments();
      const totalProducts = await Product.countDocuments();
      const totalNew = await Product.countDocuments({approved: ReviewState.Pending});
      const totalApproved = await Product.countDocuments({ approved: ReviewState.True });
      const totalDeclined = await Product.countDocuments({ approved: ReviewState.False });
      return {
        message: "Dashboard information successfully generated",
        status: 200,
        data: {
          totalNew,
          totalUsers,
          totalProducts,
          totalApproved,
          totalDeclined
        }
      };
    } catch (err) {
      console.error("Error:", err);
      return {
        message: err|| "An error occurred",
        status: 500
      };
    }
  };
  public getProductDetails = async (filter:any, page: number = 1, perPage: number = 10) => {
    try {
      const query: any = {};
      
      // Filtering by approved
      if (filter.approved !== undefined) {
          query.approved = filter.approved;
      }
      console.log("filter.approved",query.approved )
      // Validate and set default values for page and perPage
      const currentPage = page > 0 ? page : 1; // Ensure page is positive
      const itemsPerPage = perPage > 0 ? perPage : 10; // Ensure perPage is positive
  
      // Calculate the skip value
      const skip = (currentPage - 1) * itemsPerPage;
  
      // Perform the database query with pagination
      const products = await Product.find(query)
      .populate('createdBy')
      .skip(skip)
      .limit(itemsPerPage);
  
      // Get the total number of products for pagination info
      const totalProducts = await Product.countDocuments(query);
  
      return {
        message: "Product details retrieved",
        data: {
          products,
          pagination: {
            totalProducts,
            totalPages: Math.ceil(totalProducts / itemsPerPage),
            currentPage,
            perPage: itemsPerPage
          }
        },
        status: 200
      };
    } catch (err) {
      return {
        message: err,
        status: 500
      };
    }
  }
  public acceptDeclineProduct = async (id: string, accept: boolean, adminId: string) => {
    try {
      // Update the product and retrieve the updated product
      const updatedProduct = await Product.findOneAndUpdate(
        { _id: id },
        { approved: accept }, // Store boolean value directly
        { new: true } // Return the updated document
      );
  
      // Check if the product was updated
      if (!updatedProduct) {
        return {
          message: "Product update failed",
          status: 400
        };
      }
  
      console.log('updated product', updatedProduct);
  
      // Ensure the updated product has a createdBy and _id before proceeding
      if (updatedProduct.createdBy && updatedProduct._id) {
        // Create a notification
        await Notifications.create({
          user: updatedProduct.createdBy,
          Promo: updatedProduct._id,
          approvedBy: adminId
        });
      } else {
        return {
          message: "Missing required fields in updated product",
          status: 400
        };
      }
  
      // Return a success response
      return {
        message: "Product updated successfully",
        status: 200
      };
    } catch (err) {
      console.error('Error updating product:', err);
      return {
        message: err|| "An error occurred",
        status: 500
      };
    }
  }
  
  public getAllUsers = async(page:number,perPage:number)=>{
    try {
      // Validate and set default values for page and perPage
      const currentPage = page > 0 ? page : 1; // Ensure page is positive
      const itemsPerPage = perPage > 0 ? perPage : 10; // Ensure perPage is positive
    
      // Calculate the skip value
      const skip = (currentPage - 1) * itemsPerPage;
    
      // Perform the database query with pagination
      const users = await User.find()
        .skip(skip)
        .limit(itemsPerPage);
    
      // Get the total number of users for pagination info
      const totalUsers = await User.countDocuments();
    
      return {
        message: "User details retrieved",
        data: {
          users,
          pagination: {
            totalUsers,
            totalPages: Math.ceil(totalUsers / itemsPerPage),
            currentPage,
            perPage: itemsPerPage
          }
        },
        status: 200
      };
    } catch (error) {
      return {
        message: "Error retrieving user details",
        error: error,
        status: 500
      };
    }
    
  }
  private updateBanners = async (results: UploadApiResponse[]) => {
    // Create an array of update promises
    const updatePromises = results.map((bannerImage, index) => {
        // Determine which field to update based on the index
        const field = `banner${index + 1}`;
        
        // Create an update object
        const updateObj = {
            [field]: bannerImage?.secure_url
        };

        // Update the document (assuming you want to update a specific document, you need to provide a query filter)
        return Banner.findOneAndUpdate({}, updateObj, { new: true, upsert: true })
            .then(() => {
                console.log(`Banner ${index + 1} updated successfully.`);
            })
            .catch((error) => {
                console.error(`Error updating banner ${index + 1}:`, error);
            });
    });

    // Wait for all update operations to complete
    await Promise.all(updatePromises);
};

  public uploadBannerImages = async(bannerImages:[any])=>{
    try{
        // Use Promise.all to upload all images concurrently
    const uploadPromises = bannerImages.map(base64Image => {
      if(base64Image !== null)   return  uploadBase64Image(base64Image,'banner_images')
   
    });
    const results:any = await Promise.all(uploadPromises);
    const response = await this.updateBanners(results)
  
    return {
      message:"Banner Image Upload Success",
      status:201
    }
    }catch(err){
      return {
        message: "Error uploading images",
        error: err,
        status: 500
      }
    }
  }
  public getBannerImage = async()=>{
    try{
      const bannerImage = await Banner.findOne()
      console.log("bannerImage",bannerImage)
      return {
        message:'banner image gotten successfully',
        data: bannerImage,
        status:200
      }
    }catch(err){
      console.log(err)
      return {
        message:err,
        status:500
      }
    }
  }
}

const Admin = new AdminService();
export default Admin;
