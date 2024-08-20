import { Request,Response } from "express";
import authService from "../../service/auth/auth.service";

class Auth{

    public login = async (req:Request, res:Response) => {
        const {email,password} = req.body
        const response = await authService.loginService({email,password})
        return res.json(response)
    };
    public register = async (req:Request, res:Response) => {
        const {email,password,role,username} = req.body
        const response = await authService.registerService({email,password,role,username})
        console.log("response",response)
       return res.json(response)
    };
    public forgetPassword = async (req:Request, res:Response) => {};
    public getAuthUser = async (req:any, res:Response) => {
         const {email} = req?.user
        const response =  await authService.getAuthUser(email as unknown as string)
        return res.json(response)
    };
}

const authClass = new Auth();
export default authClass