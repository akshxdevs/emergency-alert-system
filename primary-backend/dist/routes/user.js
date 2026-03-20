"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = void 0;
const express_1 = require("express");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = require("../db/db");
const config_1 = require("../config");
const bcrypt_1 = __importDefault(require("bcrypt"));
const types_1 = require("../types");
const router = (0, express_1.Router)();
router.get("/check-email", async (req, res) => {
    try {
        const { email } = req.query;
        if (!email || typeof email !== 'string') {
            return res.status(400).json({ message: "Email is required" });
        }
        const existingUser = await db_1.prismaClient.user.findFirst({
            where: { email: email },
        });
        res.json({ exists: !!existingUser });
    }
    catch (error) {
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
        const user = await db_1.prismaClient.user.findFirst({
            where: { email: email },
        });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json({ user });
    }
    catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).json({ message: "Something went wrong!" });
    }
});
router.post("/google-signup", async (req, res) => {
    try {
        const parsedBody = types_1.GoogleSignupSchema.safeParse(req.body);
        if (!parsedBody.success) {
            return res
                .status(400)
                .json({ message: "Invalid Input", error: parsedBody.error.errors });
        }
        const { email, name, image, role } = parsedBody.data;
        const existingUser = await db_1.prismaClient.user.findFirst({
            where: { email: email },
        });
        if (existingUser) {
            return res.status(409).json({ message: "User already exists" });
        }
        const generateUsername = String(role + Math.floor(Math.random() * 1000000)).padStart(6, "7");
        const user = await db_1.prismaClient.user.create({
            data: {
                username: generateUsername,
                email: email,
                password: "", // Google users don't need password
                role: role,
            },
        });
        const token = jsonwebtoken_1.default.sign({ id: user.id }, config_1.JWT_SECRET, { expiresIn: "7d" });
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
    }
    catch (error) {
        console.error("Google signup error:", error);
        res.status(500).json({ message: "Something went wrong!" });
    }
});
router.post("/signup", async (req, res) => {
    try {
        const parsedBody = types_1.SigninSchema.safeParse(req.body);
        if (!parsedBody.success) {
            return res
                .status(400)
                .json({ message: "Invalid Input", error: parsedBody.error.errors });
        }
        const { email, password, role, name } = parsedBody.data;
        const generateUsername = String(role + Math.floor(Math.random() * 1000000)).padStart(6, "7");
        const existingUser = await db_1.prismaClient.user.findFirst({
            where: {
                email: email,
            },
        });
        if (existingUser) {
            return res.status(409).send({ message: "User already exist" });
        }
        const HashedPassword = await bcrypt_1.default.hash(password, 10);
        const user = await db_1.prismaClient.user.create({
            data: {
                username: generateUsername,
                email: email,
                password: HashedPassword,
                role: role,
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
    }
    catch (error) {
        console.error(error);
        res.status(403).send({ message: "Something went wrong!" });
    }
});
router.post("/signin", async (req, res) => {
    try {
        const parsedBody = types_1.LoginSchema.safeParse(req.body);
        if (!parsedBody.success) {
            return res
                .status(400)
                .json({ message: "Invalid Input", error: parsedBody.error.errors });
        }
        const { email, password } = parsedBody.data;
        const user = await db_1.prismaClient.user.findFirst({
            where: {
                email,
            },
        });
        if (!user) {
            return res.status(401).send({ message: "Invalid Email Or Password!" });
        }
        const passwordValidation = await bcrypt_1.default.compare(password, user.password);
        if (!passwordValidation) {
            return res.status(401).send({ message: "Password Mismatch!" });
        }
        const token = jsonwebtoken_1.default.sign({
            id: user.id,
        }, config_1.JWT_SECRET, { expiresIn: "1h" });
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
        res.json(response);
    }
    catch (error) {
        console.error("Signin error:", error);
        res.status(500).send({ message: "Something went wrong!" });
    }
});
exports.userRouter = router;
