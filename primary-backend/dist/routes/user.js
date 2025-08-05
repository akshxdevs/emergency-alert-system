"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = void 0;
const express_1 = require("express");
const ioredis_1 = __importDefault(require("ioredis"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = require("../db/db");
const config_1 = require("../config");
const bcrypt_1 = __importDefault(require("bcrypt"));
const types_1 = require("../types");
const router = (0, express_1.Router)();
const redis = new ioredis_1.default();
const OTP_LIMIT = 3;
const OTP_EXPIRY = 100;
// Check if user exists by email (for Google auth)
router.get("/check-email", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.query;
        if (!email || typeof email !== 'string') {
            return res.status(400).json({ message: "Email is required" });
        }
        const existingUser = yield db_1.prismaClient.user.findFirst({
            where: { email: email },
        });
        res.json({ exists: !!existingUser });
    }
    catch (error) {
        console.error("Error checking email:", error);
        res.status(500).json({ message: "Something went wrong!" });
    }
}));
// Get user by email (for Google auth)
router.get("/by-email", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.query;
        if (!email || typeof email !== 'string') {
            return res.status(400).json({ message: "Email is required" });
        }
        const user = yield db_1.prismaClient.user.findFirst({
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
}));
// Google signup with role selection
router.post("/google-signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const parsedBody = types_1.GoogleSignupSchema.safeParse(req.body);
        if (!parsedBody.success) {
            return res
                .status(400)
                .json({ message: "Invalid Input", error: parsedBody.error.errors });
        }
        const { email, name, image, role } = parsedBody.data;
        // Check if user already exists
        const existingUser = yield db_1.prismaClient.user.findFirst({
            where: { email: email },
        });
        if (existingUser) {
            return res.status(409).json({ message: "User already exists" });
        }
        // Generate username based on role
        const generateUsername = String(role + Math.floor(Math.random() * 1000000)).padStart(6, "7");
        // Create new user
        const user = yield db_1.prismaClient.user.create({
            data: {
                username: generateUsername,
                email: email,
                password: "", // Google users don't need password
                role: role,
            },
        });
        // Generate JWT token
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
}));
router.post("/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const parsedBody = types_1.SigninSchema.safeParse(req.body);
        if (!parsedBody.success) {
            return res
                .status(400)
                .json({ message: "Invalid Input", error: parsedBody.error.errors });
        }
        const { email, password, role } = parsedBody.data;
        const generateUsername = String(role + Math.floor(Math.random() * 1000000)).padStart(6, "7");
        const existingUser = yield db_1.prismaClient.user.findFirst({
            where: {
                email: email,
            },
        });
        if (existingUser) {
            return res.status(402).send({ message: "User already exist" });
        }
        const HashedPassword = yield bcrypt_1.default.hash(password, 10);
        const user = yield db_1.prismaClient.user.create({
            data: {
                username: generateUsername,
                email: email,
                password: HashedPassword,
                role: role,
            },
        });
        res.json({
            message: "User Created Sucessfully",
            user: user,
        });
    }
    catch (error) {
        console.error(error);
        res.status(403).send({ message: "Something went wrong!" });
    }
}));
router.post("/signin", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("Signin request received:", req.body);
        const parsedBody = types_1.LoginSchema.safeParse(req.body);
        if (!parsedBody.success) {
            console.log("Validation error:", parsedBody.error.errors);
            return res
                .status(400)
                .json({ message: "Invalid Input", error: parsedBody.error.errors });
        }
        const { email, password } = parsedBody.data;
        console.log("Looking for user with email:", email);
        const user = yield db_1.prismaClient.user.findFirst({
            where: {
                email,
            },
        });
        console.log("Found user:", user ? "Yes" : "No");
        if (!user) {
            return res.status(401).send({ message: "Invalid Email Or Password!" });
        }
        const passwordValidation = yield bcrypt_1.default.compare(password, user.password);
        console.log("Password validation:", passwordValidation ? "Success" : "Failed");
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
        console.log("Sending response:", response);
        res.json(response);
    }
    catch (error) {
        console.error("Signin error:", error);
        res.status(403).send({ message: "Something went wrong!" });
    }
}));
router.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { phoneNo } = req.body;
        const generateOtp = String(Math.floor(Math.random() * 1000000)).padStart(6, "7");
        const optKey = `otp:${String(phoneNo)}`;
        const otpReqCnts = yield redis.get(`otp_counts:${phoneNo}`);
        if (otpReqCnts && Number(otpReqCnts) >= OTP_LIMIT)
            return res.json({ message: "Too Many request!!" });
        yield redis.setex(optKey, OTP_EXPIRY, generateOtp);
        yield redis.incr(`otp_count:${phoneNo}`);
        yield redis.expire(`opt_count:${phoneNo}`, OTP_EXPIRY);
        res.json({
            message: `Otp: ${generateOtp} Generated Sucessfully for ${phoneNo}`,
        });
    }
    catch (error) {
        res.status(411).json({ message: "Something Went Wrong!!" });
    }
}));
router.post("/login/customer/verify-otp", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { phoneNo, userRole, otp, password, email } = req.body;
        const role = String(userRole).toLocaleLowerCase();
        const generateUsername = String(role + Math.floor(Math.random() * 1000000)).padStart(6, "7");
        if (!phoneNo || !otp) {
            return res.status(403).json({ message: "Invalid inputs!" });
        }
        const storedOtp = yield redis.get(`otp:${phoneNo}`);
        console.log(storedOtp);
        if (!storedOtp || storedOtp !== otp) {
            return res.status(401).json({ message: "Invalid or expired OTP!" });
        }
        const existingUser = yield db_1.prismaClient.user.findFirst({
            where: {
                phoneNo: phoneNo,
            },
        });
        console.log(userRole);
        if (existingUser) {
            const userToken = jsonwebtoken_1.default.sign({
                id: existingUser === null || existingUser === void 0 ? void 0 : existingUser.id,
            }, config_1.JWT_SECRET, { expiresIn: "7d" });
            yield redis.del(`otp:${phoneNo}`);
            yield redis.del(`otp_count:${phoneNo}`);
            res.json({
                message: "User Login Successfully!",
                token: userToken,
                user: existingUser,
            });
        }
        if (!existingUser) {
            const hashedPassword = yield bcrypt_1.default.hash(password, 10);
            const user = yield db_1.prismaClient.user.create({
                data: {
                    username: generateUsername,
                    email: email,
                    password: hashedPassword,
                    role: userRole,
                },
            });
            const token = jsonwebtoken_1.default.sign({
                id: user.id,
            }, config_1.JWT_SECRET, { expiresIn: "7d" });
            yield redis.del(`otp:${phoneNo}`);
            yield redis.del(`otp_count:${phoneNo}`);
            return res.json({
                message: "User Login Successfully!",
                token: token,
                user: user,
            });
        }
    }
    catch (error) {
        res.status(411).json({ message: "Something Went Wrong!!" });
    }
}));
exports.userRouter = router;
