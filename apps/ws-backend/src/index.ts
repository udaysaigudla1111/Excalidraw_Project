import { WebSocketServer } from "ws";
import jwt, { JwtPayload } from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config({path:'../../.env'})
const wss = new WebSocketServer({port:8080})
console.log(process.env.JWT_SECRET);


wss.on('connection',(socket,request)=>{

    const url = request.url 

    if(!url)
    {
        return;
    }

    const queryParams = new URLSearchParams(url.split('?')[1])

    const token = queryParams.get('token') ?? ""

    const decodedInfo = jwt.verify(token,process.env.jwt_secret!) as JwtPayload

    if(!decodedInfo.userId)
    {
        socket.close()
    }

    socket.on('message',(data)=>{

        wss.clients.forEach((client)=>{
            if(client!=socket)
            {
                client.send(`Hii ${token}`)
            }
        })

    })

})