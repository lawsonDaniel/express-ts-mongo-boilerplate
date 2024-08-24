import { Types } from "mongoose";
import { User } from "../../model/user.model";
import { apiResponse } from "../../util/apiResponse";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken';

interface LoginProps{
    email:string;
    password:string;
    role?:string;
    username?:string
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
                }else{
                    return {
                        message:"Incorrect password",
                        status: 401
                    }
                }
            }else{
                return {
                    message:"user not found",
                    status: 401
                }
            }
        }catch(err){
            console.log("message err",err)
            return {

                message: err,
                status: 500
            }
        }
    }
    public getAuthUser = async(email:string)=>{
        try{
            //find user based of thier email 
            const res:any = await User.findOne({email})
            res['password'] = null;
            delete res['password'] ;
            console.log("res from user",res)
            if(!res){
                return {
                    message:"no user found",
                    status:404
                }
            }
            return {
                message:"Authenticated user found",
                data:res,
                status:200
            }
        }catch(err){
            console.log(err)
            return {
                message:err,
                status:500
            }
        }
    }
    public updateService = async (data: any, id: string) => {
        try {
            // Check if the user exists
            const isUserFound = await User.findOne({ _id: id }); // Assuming you're using MongoDB and _id as the primary key
            if (!isUserFound) {
                return {
                    message: "User not found",
                    status: 404,
                };
            }
    
            // Update the user with the new data
            await isUserFound.updateOne(data);
    
            // Return a success response
            return {
                message: "User updated successfully",
                status: 200,
                data: await User.findOne({ _id: id }), // Fetch the updated user data
            };
        } catch (err:any) {
            return {
                message: err?.message, // Get the error message
                status: 500,
            };
        }
    };
    
    public registerService = async (data: LoginProps) => {
        try {
            let { email, password,role,username } = data;
            if(!username){
                username ='admin@admin'
            }
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
                role,
                username
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