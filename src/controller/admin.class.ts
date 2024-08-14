import { Request, Response } from "express"
import Admin from "../service/admin/admin.service"

class AdminClass {
    public  getDashboardDetails = async (req:Request,res:Response)=>{
       const response = await Admin.getDashboardDetails()
        return res.json(response) 
    }

    public getProducts = async (req:Request,res:Response)=>{
        const query = req.query
        const response = await Admin.getProductDetails(query)
    }
}

const adminClass = new AdminClass()
export default adminClass