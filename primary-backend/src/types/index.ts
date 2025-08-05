import { UserRole } from "@prisma/client";
import { z } from "zod";

export const SigninSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(Object.values(UserRole) as [string, ...string[]]),
});

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const GoogleSignupSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1),
  image: z.string().optional(),
  role: z.enum(Object.values(UserRole) as [string, ...string[]]),
});
