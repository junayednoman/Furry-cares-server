import { array, boolean, number, string, z } from "zod";
export const postValidationSchema = z.object({
  author: string(),
  title: string().min(1, { message: 'Title is required' }),
  content: string().min(1, { message: 'Content is required' }),
  images: array(string()).optional(),
  category: z.enum(['tip', 'story']),
  tags: array(string().min(1)).nonempty({ message: 'At least one tag is required' }),
  isPremium: boolean().optional().default(false),
  votes: number().optional().default(0),
  comments: array(string()).optional(),
})


// image validation
const MAX_UPLOAD_SIZE = 1024 * 1024 * 3;
const ACCEPTED_FILE_TYPES = [
  'image/png',
  'image/jpeg',
  'image/jpg',
  'png',
  'jpeg',
  'jpg',
] as const;

export const ImageFileZodSchema = z.object({
  file: z.object({
    fieldname: string(),
    originalname: string(),
    encoding: string(),
    mimetype: z.enum(ACCEPTED_FILE_TYPES),
    path: string(),
    size: z
      .number()
      .refine(
        (size) => size <= MAX_UPLOAD_SIZE,
        'File size must be less than 3MB'
      ),
    filename: string(),
  })
});