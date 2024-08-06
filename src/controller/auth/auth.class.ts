import { Request,Response } from "express";

class Auth{

    public login = async (req:Request, res:Response) => {};
    public register = async (req:Request, res:Response) => {};
    public forgetPassword = async (req:Request, res:Response) => {};
    public getAuthUser = async (req:Request, res:Response) => {
        res.send('working')
    };
}

const authClass = new Auth();
export default authClass