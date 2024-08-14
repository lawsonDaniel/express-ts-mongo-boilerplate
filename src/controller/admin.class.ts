import { Request, Response } from "express"
import Admin from "../service/admin/admin.service"

class AdminClass {
    public  getDashboardDetails = async (req:Request,res:Response)=>{
       const response = await Admin.getDashboardDetails()
        return res.json(response) 
    }

    public getProducts = async (req:Request,res:Response)=>{
        const query = req.params
        const {page,perPage} = req.params
        const response = await Admin.getProductDetails(query,page as unknown as number,perPage as unknown as number)
        return res.json(response)
    }
    public acceptDeclineProduct = async(req: Request, res: Response)=>{
   const {id}  = req.query
   const {accept} = req.body
        const response = await Admin.acceptDeclineProduct(id as unknown as string,accept)
        return res.json(response)
    }
    public getAllUsers = async(req: Request, res: Response)=>{
        const {page,perPage} = req.params
        const response = await Admin.getAllUsers(page as unknown as number,perPage as unknown as number)
        return res.json(response)
    }
}

const adminClass = new AdminClass()
export default adminClass