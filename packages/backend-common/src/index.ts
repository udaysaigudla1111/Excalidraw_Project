import dotenv from 'dotenv'
dotenv.config();

export const JWT_SECRET=process.env.JWT_SECRET!
export const NAME=process.env.NAME || "Test"
// console.log(JWT_SECRET);
// console.log(NAME);
export const demo="uday"
