import { Router } from "express";
import Redis from "ioredis";
import jwt from "jsonwebtoken";
import { prismaClient } from "../db/db";
import { JWT_SECRET } from "../config";
import bcrypt from "bcrypt";
import { SigninSchema } from "../types";
const router = Router();
const redis = new Redis();
const OTP_LIMIT = 3;
const OTP_EXPIRY = 100;

router.post("/signup",async(req,res)=>{
    try {
        const parsedBody = SigninSchema.safeParse(req.body);
        
        if (!parsedBody.success) {
            return res.status(400).json({message:"Invalid Input",error:parsedBody.error.errors})
        }
        const {email,password,userRole} = parsedBody.data;
        const role = String(userRole).toLocaleLowerCase();
        const generateUsername:string = String(role + (Math.floor(Math.random()*1000000))).padStart(6,"7");
        const existingUser = await prismaClient.user.findFirst({
            where:{
                email:email
            }
        })
        if (existingUser){
            return res.status(402).send({message:"User already exist"})
        }
        const HashedPassword = await bcrypt.hash(password,10)
        const user = await prismaClient.user.create({
            data:{
                username:generateUsername,
                email:email,
                password:HashedPassword,
                role:userRole
            }
        })
        res.json({
            message:"User Created Sucessfully",
            user:user
        })
    } catch (error) {
        console.error(error);
        res.status(403).send({message:"Something went wrong!"})
    }
})

router.post("/signin",async(req,res)=>{
    try {
        const parsedBody = SigninSchema.safeParse(req.body);
        if (!parsedBody.success) {
            return res.status(400).json({message:"Invalid Input",error:parsedBody.error.errors})
        }
        const {email,password} = parsedBody.data
        const user = await prismaClient.user.findFirst({
            where:{
                email,
            }
        })
        if (!user) {
            return res.status(401).send({message:"Invalid Email Or Password!"})
        }
        const passwordValidation = await bcrypt.compare(password,user.password);
        if (!passwordValidation) {
            return res.status(401).send({message:"Password Mismatch!"}) 
        }
        const token = jwt.sign({
            id:user.id
        },JWT_SECRET as string,{expiresIn:"1h"})
        res.json({
            user:{
                name:user.username,
                email:user.email,
                id:user.id
            },
            token,
            message:"User Login Sucessfully"
        })  
    } catch (error) {
        console.error(error);
        res.status(403).send({message:"Something went wrong!"})
    }
})
router.post("/login",async(req,res)=>{
    try {
        const {phoneNo} = req.body;
        const generateOtp:string = String((Math.floor(Math.random()*1000000))).padStart(6,"7"); 
        const optKey = `otp:${String(phoneNo)}`
        const otpReqCnts = await redis.get(`otp_counts:${phoneNo}`)
        if (otpReqCnts && Number(otpReqCnts) >= OTP_LIMIT ) return res.json({message:"Too Many request!!"});
        await redis.setex(optKey,OTP_EXPIRY,generateOtp);
        await redis.incr(`otp_count:${phoneNo}`);
        await redis.expire(`opt_count:${phoneNo}`,OTP_EXPIRY)
        res.json({message:`Otp: ${generateOtp} Generated Sucessfully for ${phoneNo}`})
    } catch (error) {
        res.status(411).json({message:"Something Went Wrong!!"})
    }
});
router.post("/login/customer/verify-otp",async(req,res)=>{
    try {
        const {phoneNo,userRole,otp,password,email} = req.body;
        const role = String(userRole).toLocaleLowerCase();
        const generateUsername:string = String(role + (Math.floor(Math.random()*1000000))).padStart(6,"7");
        if (!phoneNo || !otp) {
            return res.status(403).json({message:"Invalid inputs!"})
        }
        const storedOtp = await redis.get(`otp:${phoneNo}`);
        console.log(storedOtp);
        if (!storedOtp || storedOtp !== otp) {
            return res.status(401).json({ message: "Invalid or expired OTP!" });
        }
        const existingUser = await prismaClient.user.findFirst({
            where:{
                phoneNo:phoneNo
            }
        });
        console.log(userRole);
        
        if (existingUser) {
        const userToken = jwt.sign({
            id:existingUser?.id
        },JWT_SECRET as string,{expiresIn:'7d'}); 
        await redis.del(`otp:${phoneNo}`);
        await redis.del(`otp_count:${phoneNo}`);
        res.json({
            message:"User Login Successfully!",
            token:userToken,
            user:existingUser
        }); 
        }
        if (!existingUser) {
            const hashedPassword = await bcrypt.hash(password,10);
            const user = await prismaClient.user.create({
                data:{
                    username:generateUsername,
                    email:email,
                    password:hashedPassword,
                    role:userRole
                }
            });
            const token = jwt.sign({
                id:user.id
            },JWT_SECRET as string,{expiresIn:'7d'}); 
            await redis.del(`otp:${phoneNo}`);
            await redis.del(`otp_count:${phoneNo}`);
            return res.json({
                message:"User Login Successfully!",
                token:token,
                user:user
            });
        }
    } catch (error) {
        res.status(411).json({message:"Something Went Wrong!!"})
    }
})


export const userRouter = router;