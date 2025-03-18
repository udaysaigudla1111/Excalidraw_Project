import express from 'express'
import jwt, { JwtPayload } from 'jsonwebtoken'
import { roomMiddleware } from './middleware';
import { CreateUserSchema,SigninSchema,CreateRoomSchema } from '@repo/common/types';
const app = express();
app.use(express.json())

import dotenv from 'dotenv'

dotenv.config({path:'../../.env'});


console.log(process.env.JWT_SECRET);

//////////////////////////////////////////////////////////////////////////////////////////////////////////////

app.post("/signup",(req,res)=>{
    res.send("User signup successfully!!!!!!!!")
})

////////////////////////////////////////////////////////////////////////////////////////////////////////////////

app.post("/signin",(req,res)=>{

    const userId=1
    const token = jwt.sign({userId},process.env.JWT_SECRET!)

    res.status(200).json({
        message:"User logged in successfully",
        token
    })
    return
})

///////////////////////////////////////////////////////////////////////////////////////////////////////

app.post("/create-room",roomMiddleware,(req,res)=>{
    res.send("In the create room")
})


///////////////////////////////////////////////////////////////////////////////////////////////////////
app.listen(3002,()=>{

    console.log(`The server is listening on port number ${3002}`);

})
