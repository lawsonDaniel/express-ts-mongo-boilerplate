import { Request, Response } from "express";
import userService from "../service/user/user.service";

class userControllerClass {
    public getProduct = async(req:any, res:Response)=>{
        try{
            const query = req.query;  // Use req.query instead of req.params
            const { _id } = req?.user;
            console.log("query", query);
            const response = await userService.filter(query,_id)
            return res.json(response)
        }catch(err){
            return{
                message:err,
                status:500
            }
        }
    }
    public getPromo = async(req:any, res:Response)=>{
        try{
            const query = req.query;
            console.log("filterquery",query)
            const response = await userService.publicFilter(query)
            return res.json(response)
        }catch(err){
            return{
                message:err,
                status:500
            }
        }
    }
    public getProductCount = async(req:any, res:Response)=>{
        try{
            const query = req.params;
            const {_id} = req?.user;
            const response = await userService.getPromoCount(_id)
            return res.json(response)
        }catch(err){
            return{
                message:err,
                status:500
            }
        }
        
    }
    public getAdminProductCount = async(req:any, res:Response)=>{
        try{
            const query = req.params;
          
            const response = await userService.getAdminPromoCount()
            return res.json(response)
        }catch(err){
            return{
                message:err,
                status:500
            }
        }
        
    }
    public updateTemprature = async(req:Request, res:Response)=>{
        try{
            const response = await userService.updateTemperature(req.body)
            return res.json(response)
        }catch(err){
            return{
                message:err,
                status:500
            }
        }
    }
    public getNotification = async (req: any, res: Response) => {
        try {
            console.log('request',req?.user)
          if (!req?.user || !req?.user._id) {
            return res.status(400).json({
              message: "User ID not found in request.",
              status: 400,
            });
          }
      
          const { _id } = req.user;
          const response = await userService.getNotification(_id);
      
          return res.status(200).json({
            data: response,
            status: 200,
          });
        } catch (err: any) {
          console.error('Error in getNotification:', err.message || err);
      
          return res.status(500).json({
            message: err.message || "Internal Server Error",
            status: 500,
          });
        }
      };
       
    public uploadPromo = async(req:any, res:Response)=>{
        try{
            const body = req.body;
            const {_id} = req?.user;
            const {images} = req.body;
            console.log("images.length",images)
            if (!Array.isArray(images) || images.length === 0) {
             return res.status(400).json({ message: 'please upload 8 images', });
           }
            // Ensure the array has a maximum of 8 images
         if (images.length > 9) {
             return res.status(400).json({ 
                message: 'You can only upload up to 8 images at a time',
                status:400
            });
           }
           if (images.length < 8) {
            return res.status(400).json({ 
                message: `You need to upload ${8 - images.length } more images` ,
                status:400
            });
          }
            const response = await userService.createPromo(body,_id)
            return res.json(response)
        }catch(err){
            return{
                message:err,
                status:500
            }
        }
}
}

const userClass = new userControllerClass();
export default userClass;