import { Router } from "express";
import Redis from "ioredis";
import jwt from "jsonwebtoken";
import { prismaClient } from "../db/db";
import { JWT_SECRET } from "../config";
import bcrypt from "bcrypt";
import { SigninSchema, GoogleSignupSchema, LoginSchema } from "../types";
import { UserRole } from "@prisma/client";
const router = Router();
const redis = new Redis();
const OTP_LIMIT = 3;
const OTP_EXPIRY = 100;

router.get("/check-email", async (req, res) => {
  try {
    const { email } = req.query;
    
    if (!email || typeof email !== 'string') {
      return res.status(400).json({ message: "Email is required" });
    }

    const existingUser = await prismaClient.user.findFirst({
      where: { email: email },
    });

    res.json({ exists: !!existingUser });
  } catch (error) {
    console.error("Error checking email:", error);
    res.status(500).json({ message: "Something went wrong!" });
  }
});

router.get("/by-email", async (req, res) => {
  try {
    const { email } = req.query;
    
    if (!email || typeof email !== 'string') {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await prismaClient.user.findFirst({
      where: { email: email },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ user });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Something went wrong!" });
  }
});

router.post("/google-signup", async (req, res) => {
  try {
    const parsedBody = GoogleSignupSchema.safeParse(req.body);
    
    if (!parsedBody.success) {
      return res
        .status(400)
        .json({ message: "Invalid Input", error: parsedBody.error.errors });
    }

    const { email, name, image, role } = parsedBody.data;

    const existingUser = await prismaClient.user.findFirst({
      where: { email: email },
    });

    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    const generateUsername: string = String(
      role + Math.floor(Math.random() * 1000000)
    ).padStart(6, "7");

    const user = await prismaClient.user.create({
      data: {
        username: generateUsername,
        email: email,
        password: "", // Google users don't need password
        role: role as UserRole,
      },
    });

    const token = jwt.sign(
      { id: user.id },
      JWT_SECRET as string,
      { expiresIn: "7d" }
    );

    res.json({
      message: "User created successfully",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.error("Google signup error:", error);
    res.status(500).json({ message: "Something went wrong!" });
  }
});

router.post("/signup", async (req, res) => {
  try {
    const parsedBody = SigninSchema.safeParse(req.body);

    if (!parsedBody.success) {
      return res
        .status(400)
        .json({ message: "Invalid Input", error: parsedBody.error.errors });
    }
    const { email, password, role, name } = parsedBody.data;
    const generateUsername: string = String(
      role + Math.floor(Math.random() * 1000000)
    ).padStart(6, "7");
    const existingUser = await prismaClient.user.findFirst({
      where: {
        email: email,
      },
    });
    if (existingUser) {
      return res.status(402).send({ message: "User already exist" });
    }
    const HashedPassword = await bcrypt.hash(password, 10);
    const user = await prismaClient.user.create({
      data: {
        username: generateUsername,
        email: email,
        password: HashedPassword,
        role: role as UserRole,
        name: name || generateUsername,
      },
    });
    res.json({
      message: "User Created Sucessfully",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(403).send({ message: "Something went wrong!" });
  }
});

router.post("/signin", async (req, res) => {
  try {
    console.log("Signin request received:", req.body);
    
    const parsedBody = LoginSchema.safeParse(req.body);
    if (!parsedBody.success) {
      console.log("Validation error:", parsedBody.error.errors);
      return res
        .status(400)
        .json({ message: "Invalid Input", error: parsedBody.error.errors });
    }
    const { email, password } = parsedBody.data;
    console.log("Looking for user with email:", email);
    
    const user = await prismaClient.user.findFirst({
      where: {
        email,
      },
    });
    
    console.log("Found user:", user ? "Yes" : "No");
    
    if (!user) {
      return res.status(401).send({ message: "Invalid Email Or Password!" });
    }
    
    const passwordValidation = await bcrypt.compare(password, user.password);
    console.log("Password validation:", passwordValidation ? "Success" : "Failed");
    
    if (!passwordValidation) {
      return res.status(401).send({ message: "Password Mismatch!" });
    }
    
    const token = jwt.sign(
      {
        id: user.id,
      },
      JWT_SECRET as string,
      { expiresIn: "1h" }
    );
    
    const response = {
      user: {
        id: user.id,
        email: user.email,
        name: user.username, // Use username as name for NextAuth
        username: user.username,
        role: user.role,
      },
      token,
      message: "User Login Sucessfully",
    };
    
    console.log("Sending response:", response);
    res.json(response);
  } catch (error) {
    console.error("Signin error:", error);
    res.status(403).send({ message: "Something went wrong!" });
  }
});
router.post("/login", async (req, res) => {
  try {
    const { phoneNo } = req.body;
    const generateOtp: string = String(
      Math.floor(Math.random() * 1000000)
    ).padStart(6, "7");
    const optKey = `otp:${String(phoneNo)}`;
    const otpReqCnts = await redis.get(`otp_counts:${phoneNo}`);
    if (otpReqCnts && Number(otpReqCnts) >= OTP_LIMIT)
      return res.json({ message: "Too Many request!!" });
    await redis.setex(optKey, OTP_EXPIRY, generateOtp);
    await redis.incr(`otp_count:${phoneNo}`);
    await redis.expire(`opt_count:${phoneNo}`, OTP_EXPIRY);
    res.json({
      message: `Otp: ${generateOtp} Generated Sucessfully for ${phoneNo}`,
    });
  } catch (error) {
    res.status(411).json({ message: "Something Went Wrong!!" });
  }
});
router.post("/login/customer/verify-otp", async (req, res) => {
  try {
    const { phoneNo, userRole, otp, password, email } = req.body;
    const role = String(userRole).toLocaleLowerCase();
    const generateUsername: string = String(
      role + Math.floor(Math.random() * 1000000)
    ).padStart(6, "7");
    if (!phoneNo || !otp) {
      return res.status(403).json({ message: "Invalid inputs!" });
    }
    const storedOtp = await redis.get(`otp:${phoneNo}`);
    console.log(storedOtp);
    if (!storedOtp || storedOtp !== otp) {
      return res.status(401).json({ message: "Invalid or expired OTP!" });
    }
    const existingUser = await prismaClient.user.findFirst({
      where: {
        phoneNo: phoneNo,
      },
    });
    console.log(userRole);

    if (existingUser) {
      const userToken = jwt.sign(
        {
          id: existingUser?.id,
        },
        JWT_SECRET as string,
        { expiresIn: "7d" }
      );
      await redis.del(`otp:${phoneNo}`);
      await redis.del(`otp_count:${phoneNo}`);
      res.json({
        message: "User Login Successfully!",
        token: userToken,
        user: existingUser,
      });
    }
    if (!existingUser) {
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await prismaClient.user.create({
        data: {
          username: generateUsername,
          email: email,
          password: hashedPassword,
          role: userRole,
        },
      });
      const token = jwt.sign(
        {
          id: user.id,
        },
        JWT_SECRET as string,
        { expiresIn: "7d" }
      );
      await redis.del(`otp:${phoneNo}`);
      await redis.del(`otp_count:${phoneNo}`);
      return res.json({
        message: "User Login Successfully!",
        token: token,
        user: user,
      });
    }
  } catch (error) {
    res.status(411).json({ message: "Something Went Wrong!!" });
  }
});

export const userRouter = router;
