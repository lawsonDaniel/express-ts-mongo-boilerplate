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
  public getProductDetails = async(query:ProductQueryParams)=>{
    try{
      const product = await Product.find({
        query
      })
      return {
        message:"product gotten",
        data: product,
        status:200
      }
    }catch(err){
      return {
        message:err,
        status:500
      }
    }
  }
}

const Admin = new AdminService();
export default Admin;
