"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoogleSignupSchema = exports.LoginSchema = exports.SigninSchema = void 0;
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
exports.SigninSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(6),
    role: zod_1.z.enum(Object.values(client_1.UserRole)),
    name: zod_1.z.string().optional(),
});
exports.LoginSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(6),
});
exports.GoogleSignupSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    name: zod_1.z.string().min(1),
    image: zod_1.z.string().optional(),
    role: zod_1.z.enum(Object.values(client_1.UserRole)),
});
