import { Request, Response } from "express"
import Admin from "../service/admin/admin.service"

class AdminClass {
    public  getDashboardDetails = async (req:Request,res:Response)=>{
       const response = await Admin.getDashboardDetails()
        return res.json(response)
       
    }
}

const adminClass = new AdminClass()
export default adminClass