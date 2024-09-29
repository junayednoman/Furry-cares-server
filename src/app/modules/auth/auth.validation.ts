import { z } from 'zod';

export const UserValidationSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email format").min(1, "Email is required"),
  password: z.string({ required_error: "Password is required" }),
  bio: z.string().optional(),
  profilePicture: z.string().optional(),
});
export const UserLoginValidationSchema = z.object({
  email: z.string().email("Invalid email format").min(1, "Email is required"),
  password: z.string({ required_error: "Password is required" }),
});
