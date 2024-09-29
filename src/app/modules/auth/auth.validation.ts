import { z } from 'zod';

export const UserValidationSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email format").min(1, "Email is required"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
  bio: z.string().optional(),
  profilePicture: z.string().optional(),
});
