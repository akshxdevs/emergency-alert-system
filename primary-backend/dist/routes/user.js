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
const router = (0, express_1.Router)();
const redis = new ioredis_1.default();
const OTP_LIMIT = 3;
const OTP_EXPIRY = 100;
router.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { phoneNo } = req.body;
        const generateOtp = String((Math.floor(Math.random() * 1000000))).padStart(6, "7");
        const optKey = `otp:${String(phoneNo)}`;
        const otpReqCnts = yield redis.get(`otp_counts:${phoneNo}`);
        if (otpReqCnts && Number(otpReqCnts) >= OTP_LIMIT)
            return res.json({ message: "Too Many request!!" });
        yield redis.setex(optKey, OTP_EXPIRY, generateOtp);
        yield redis.incr(`otp_count:${phoneNo}`);
        yield redis.expire(`opt_count:${phoneNo}`, OTP_EXPIRY);
        res.json({ message: `Otp: ${generateOtp} Generated Sucessfully for ${phoneNo}` });
    }
    catch (error) {
        res.status(411).json({ message: "Something Went Wrong!!" });
    }
}));
router.post("/login/customer/verify-otp", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { phoneNo, userRole, otp, password, email } = req.body;
        const role = String(userRole).toLocaleLowerCase();
        const generateUsername = String(role + (Math.floor(Math.random() * 1000000))).padStart(6, "7");
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
                phoneNo: phoneNo
            }
        });
        console.log(userRole);
        if (existingUser) {
            const userToken = jsonwebtoken_1.default.sign({
                id: existingUser === null || existingUser === void 0 ? void 0 : existingUser.id
            }, config_1.JWT_SECRET, { expiresIn: '7d' });
            yield redis.del(`otp:${phoneNo}`);
            yield redis.del(`otp_count:${phoneNo}`);
            res.json({
                message: "User Login Successfully!",
                token: userToken,
                user: existingUser
            });
        }
        if (!existingUser) {
            const hashedPassword = yield bcrypt_1.default.hash(password, 10);
            const user = yield db_1.prismaClient.user.create({
                data: {
                    username: generateUsername,
                    email: email,
                    password: hashedPassword,
                    role: userRole
                }
            });
            const token = jsonwebtoken_1.default.sign({
                id: user.id
            }, config_1.JWT_SECRET, { expiresIn: '7d' });
            yield redis.del(`otp:${phoneNo}`);
            yield redis.del(`otp_count:${phoneNo}`);
            return res.json({
                message: "User Login Successfully!",
                token: token,
                user: user
            });
        }
    }
    catch (error) {
        res.status(411).json({ message: "Something Went Wrong!!" });
    }
}));
exports.userRouter = router;
