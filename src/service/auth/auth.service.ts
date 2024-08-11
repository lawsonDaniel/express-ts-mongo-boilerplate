import { Types } from "mongoose";
import { User } from "../../model/user.model";
import { apiResponse } from "../../util/apiResponse";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken';

interface LoginProps{
    email:string;
    password:string;
}
interface User {
    email?: string;
    password?: string | null;
    image?: string;
    isVerified?: boolean;
    _id?: Types.ObjectId;
}
class AuthService {
    public loginService = async(data:LoginProps)=>{
        const {email,password} = data;
        try{
            //find user
            const isUserFound:User| null= await User.findOne({email}).lean();
            console.log("isUserFound",isUserFound)
            if(isUserFound && isUserFound?.password){
                //do something
                const isPassHash = await bcrypt.compare(password,isUserFound?.password)
                console.log("isPassHash",isPassHash)
                if(isPassHash){
                    isUserFound['password'] = undefined;
                    delete isUserFound['password']
                    const token = await jwt.sign(isUserFound, process.env.JWT_SECRET_STRING as string);
                    return {
                        message:"login success",
                        status: 200,
                        data:isUserFound,
                        token
                    }
                }
            }else{
                return {
                    message:"user not found",
                    status: 404
                }
            }
        }catch(err){
            console.log("message err",err)
            return {

                massage: err,
                status: 500
            }
        }
    }
    public registerService = async (data: LoginProps) => {
        try {
            const { email, password } = data;
            if (email.trim().length < 1 || password.trim().length < 1) {
                return {
                    message: "Please enter your email or password",
                    status: 400
                };
            }
    
            // Check if the user already exists
            const userFound = await User.findOne({ email });
            if (userFound) {
                return {
                    message: "User with email already exists",
                    status: 400
                };
            }
    
            // Hash the password
            const hash = await bcrypt.hash(password, 10);
    
            // Create a new user
            const createdUser:User = await User.create({
                email,
                password: hash,
            });
       
           createdUser['password'] = undefined;
           delete createdUser['password']
            return {
                message: "User created successfully",
                status: 201,
                data: createdUser
            };
        } catch (err:unknown) {
            return {
                message: err || "An error occurred",
                status: 500
            };
        }
    }
}    


const authService = new AuthService();
export default authService