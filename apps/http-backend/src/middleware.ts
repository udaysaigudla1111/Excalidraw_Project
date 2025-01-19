import { Request,Response,NextFunction } from "express";
import jwt, { JwtPayload } from 'jsonwebtoken'


interface CustomInterface extends Request{
    userId:string
}

const roomMiddleware = (req:Request,res:Response,next:NextFunction)=>{

    const token = req.headers.token as string;
    console.log(token);
    const decodedInfo = jwt.verify(token,process.env.jwt_secret!) as JwtPayload
    console.log(decodedInfo.userId);
    if(decodedInfo.userId)
    {
        (req as CustomInterface).userId = decodedInfo.userId
        next();
    }
    else{
        res.status(400).json({
            message:"Unauthorized"
        })
    }

}

export {roomMiddleware}