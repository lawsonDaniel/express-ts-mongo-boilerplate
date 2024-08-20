import { Response } from "express"

export const apiResponse = (res:Response,data:unknown,status:number,message:string)=>{
    if(status >= 200 && status < 300){
        return res.json({
            message,
            data,
            success:true
        })
    }else{
        return res.json({
            message,
            data,
            success:false
        })
    }
   
}

