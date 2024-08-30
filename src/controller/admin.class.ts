import { Request, Response } from "express"
import Admin from "../service/admin/admin.service"

class AdminClass {
    public  getDashboardDetails = async (req:Request,res:Response)=>{
       const response = await Admin.getDashboardDetails()
        return res.status(response.status).json(response) 
    }

    public getProducts = async (req:Request,res:Response)=>{
        const query = req.query
        const {page,perPage} = req.params
        const response = await Admin.getProductDetails(query,page as unknown as number,perPage as unknown as number)
        return res.status(response.status).json(response)
    }
    public acceptDeclineProduct = async(req: Request, res: Response)=>{
   const {id}  = req.query
   const {accept} = req.body
   console.log("idd",id,accept)
        const response = await Admin.acceptDeclineProduct(id as unknown as string,accept)
        return res.status(response.status).json(response)
    }
    public getAllUsers = async(req: Request, res: Response)=>{
        const {page,perPage} = req.params
        const response = await Admin.getAllUsers(page as unknown as number,perPage as unknown as number)
        return res.status(response.status).json(response)
    }
    public uploadBannerImage = async(req: Request, res: Response)=>{
       const {banner_image} = req.body;
       console.log("banner_image.length",banner_image?.length)
       if (!Array.isArray(banner_image) || banner_image.length === 0) {
        return res.status(400).json({ message: 'An array of Base64 image strings is required', });
      }
       // Ensure the array has a maximum of 8 images
    if (banner_image.length > 9) {
        return res.status(400).json({ error: 'You can only upload up to 9 images at a time' });
      }
      const response = await Admin.uploadBannerImages(banner_image as unknown as [any])
      return res.json(response)
    }
    public bannerImage = async (req:Request, res: Response)=>{
        const response  = await Admin.getBannerImage()
        return res.status(response?.status).json(response)
    }
}

const adminClass = new AdminClass()
export default adminClass