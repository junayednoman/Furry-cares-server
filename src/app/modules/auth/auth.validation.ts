import { z } from 'zod';

export const UserValidationSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string({ required_error: "Email is required" }).email("Invalid email format"),
  password: z.string({ required_error: "Password is required" }),
  bio: z.string().optional(),
  profilePicture: z.string().optional(),
});

export const UserUpdateValidationSchema = z.object({
  name: z.string().optional(),
  bio: z.string().optional(),
  profilePicture: z.string().optional(),
  coverPhoto: z.string().optional(),
});

export const UserLoginValidationSchema = z.object({
  email: z.string({ required_error: "Email is required" }).email("Invalid email format"),
  password: z.string({ required_error: "Password is required" }),
});

export const ForgetPasswordValidationSchema = z.object({
  email: z.string({ required_error: "Email is required" }).email("Invalid email format"),
});

export const ResetPasswordValidationSchema = z.object({
  email: z.string({ required_error: "Email is required" }).email("Invalid email format"),
  newPassword: z.string({ required_error: "Password is required" }),
});
