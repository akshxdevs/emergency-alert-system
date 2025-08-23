import { Router, Request, Response } from "express";
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

router.get("/check-email", async (req: Request, res: Response) => {
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

router.get("/by-email", async (req: Request, res: Response) => {
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

router.post("/google-signup", async (req: Request, res: Response) => {
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

router.post("/signup", async (req: Request, res: Response) => {
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

router.post("/signin", async (req: Request, res: Response) => {
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


export const userRouter = router;
