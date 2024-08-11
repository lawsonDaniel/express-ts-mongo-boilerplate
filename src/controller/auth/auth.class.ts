import { Request,Response } from "express";
import authService from "../../service/auth/auth.service";

class Auth{

    public login = async (req:Request, res:Response) => {
        const {email,password} = req.body
        const response = await authService.loginService({email,password})
        return res.json(response)
    };
    public register = async (req:Request, res:Response) => {
        const {email,password} = req.body
        const response = await authService.registerService({email,password})
        console.log("response",response)
       return res.json(response)
    };
    public forgetPassword = async (req:Request, res:Response) => {};
    public getAuthUser = async (req:Request, res:Response) => {
        res.send('working')
    };
}

const authClass = new Auth();
export default authClass