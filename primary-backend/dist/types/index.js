"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SigninSchema = void 0;
const zod_1 = require("zod");
exports.SigninSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(6),
    userRole: zod_1.z.enum(["CIVILIAN", "POLICE", "FIRE", "MEDICAL"])
});
