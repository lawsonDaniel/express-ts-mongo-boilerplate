import { Product } from "../../model/product.model";
import { User } from "../../model/user.model";

interface ProductQueryParams {
  approved?:boolean
}
class AdminService {
  public getDashboardDetails = async () => {
    try {
      // Await all countDocuments promises
      const totalUsers = await User.countDocuments();
      const totalProducts = await Product.countDocuments();
      const totalApproved = await Product.countDocuments({ approved: true });
      const totalDeclined = await Product.countDocuments({ approved: false });
      return {
        message: "Dashboard information successfully generated",
        status: 200,
        data: {
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
  public getProductDetails = async (query: ProductQueryParams, page: number = 1, perPage: number = 10) => {
    try {
      // Validate and set default values for page and perPage
      const currentPage = page > 0 ? page : 1; // Ensure page is positive
      const itemsPerPage = perPage > 0 ? perPage : 10; // Ensure perPage is positive
  
      // Calculate the skip value
      const skip = (currentPage - 1) * itemsPerPage;
  
      // Perform the database query with pagination
      const products = await Product.find({
        ...query,
        skip,
        limit: itemsPerPage
      });
  
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
  public acceptDeclineProduct = async(id: string,accept: boolean)=>{
    try{
   // Update the product
const updatedProduct = await Product.updateOne({ _id: id }, { approved: accept });
if (updatedProduct.modifiedCount === 0) {
  return {
    message: "Product update failed",
    status: 400
  };
}

// Return a success response if needed
return {
  message: "Product updated successfully",
  status: 200
};

    }catch(err){
      return {
        message:err,
        status:500
      }
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
}

const Admin = new AdminService();
export default Admin;
