import express from 'express'
import jwt, { JwtPayload } from 'jsonwebtoken'
import {roomMiddleware} from './middleware';
import { CreateUserSchema,SigninSchema,CreateRoomSchema } from '@repo/common/types';
import {prisma,Prisma} from "@repo/db/client"
import bcrypt from 'bcrypt'
import { CustomInterface } from './middleware';

const app = express();
app.use(express.json())

import dotenv from 'dotenv'
dotenv.config({path:'../../.env'})


console.log(process.env.JWT_SECRET);

//////////////////////////////////////////////////////////////////////////////////////////////////////////////

app.post("/signup",async (req,res)=>{
    
    const requiredBody = CreateUserSchema.safeParse(req.body)

    if(!requiredBody.success)
    {
        res.status(400).json({
            message:"Please send the data correctly",
            error:requiredBody.error
        })
        return
    }
    try {
        const userdata = requiredBody.data;
        console.log(userdata);
        
        const hashedPassword = await bcrypt.hash(userdata.password,10)
        console.log(hashedPassword);
        
        const user = await prisma.user.create({
        data:{
            email:userdata.email,
            avatar:userdata.avatar,
            name:userdata.name,
            password:hashedPassword
        }
        })

        console.log(user+"dfgwsdfghgfwwsedfg");
        
        res.status(200).json({
            message:"User Signup successfully",
            user
        })
        return

    } catch (error) {
       if(error instanceof Prisma.PrismaClientKnownRequestError)
       {
            res.status(400).json({
                message:"Prisma error",
                code:error.code,
                Errormessage:error.message,
                clientVersion:error.clientVersion,
                meta:error.meta
            })
            return
       }
       
       else{
        res.status(500).json({
            message:"Internal server error"
        })
        return
       }
    }
})

////////////////////////////////////////////////////////////////////////////////////////////////////////////////

app.post("/signin",async (req,res)=>{

    const requiredBody = SigninSchema.safeParse(req.body)

    if(!requiredBody.success)
    {
        res.status(400).json({
            message:"Please send the data correctly",
            error:requiredBody.error
        })
        return
    }
    const data = requiredBody.data

    try {

        const user = await prisma.user.findUnique({   // findUnique does not throw any error, instead it returns the null as the not found case
            where:{
                email:data.email
            }
        })

        if(user)
        {
            const isPasswordMatched = await bcrypt.compare(data.password,user.password)
            if(!isPasswordMatched)
            {
                res.status(400).json({
                    message:"Incorrect Password"
                })
                return
            }

            const token= jwt.sign({
                userId:user.id
            },process.env.JWT_SECRET!)

            res.status(200).json({
                message:"User login successfull",
                token
            })
            return

        }
        else{
            res.status(400).json({
                message:"User not found please signup"
            })
            return
        }

    } catch (error) {
        res.status(500).json({
            message:"Internal server error"
        })
        return
    }

   
})

//////////////////////////////////////////////////////////////////////////////////////////////////////////////

app.post("/create-room",roomMiddleware,async (req,res)=>{

    const requiredBody = CreateRoomSchema.safeParse(req.body)

    if(!requiredBody.success)
    {
        res.status(400).json({
            message:"Please send the data correctly",
            error:requiredBody.error
        })
        return
    }

    const adminId = (req as CustomInterface).userId

    try {
    
        const room  = await prisma.room.create({
            data:{
                slug:requiredBody.data.name,
                adminId
            }
        })

        res.status(200).json({
            message:"Room created successfully",
            Slug:room.slug,
            adminId:room.adminId,
            roomId:room.adminId
        })
        return
        
    } catch (error) {
        if(error instanceof Prisma.PrismaClientKnownRequestError)
        {
            res.status(400).json({
                message:"Prisma error",
                code:error.code,
                meta:error.meta,
                ErrorMessage:error.message,
                ClientVersion:error.clientVersion
            })
            return
        }

        res.status(500).json({
            message:"Internal server error"
        })
        return
    }

})


/////////////////////////////////////////////////////////////////////////////////////////////////////////////
app.listen(3002,()=>{

    console.log(`The server is listening on port number ${3002}`);

})
