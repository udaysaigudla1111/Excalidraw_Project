import {z} from 'zod'

export const CreateUserSchema = z.object({
    email:z.string().min(3).max(20),
    password:z.string(),
    name:z.string(),
    avatar:z.string().optional()
})
 

export const SigninSchema = z.object({
    email:z.string().min(3).max(20),
    password:z.string()
})


export const CreateRoomSchema = z.object({
    name:z.string().min(3).max(20)
})