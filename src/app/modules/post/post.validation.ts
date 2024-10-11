import { array, boolean, number, string, z } from "zod";
export const postValidationSchema = z.object({
  author: string({ required_error: 'Author ID is required' }),
  title: string().min(1, { message: 'Title is required' }),
  content: string().optional(),
  excerpt: string().optional(),
  category: z.enum(['tip', 'story']),
  tags: array(string()).optional(),
  isPremium: boolean().optional().default(false),
})

export const postUpdateValidationSchema = z.object({
  title: string().optional(),
  content: string().optional(),
  excerpt: string().optional(),
  category: z.enum(['tip', 'story']).optional(),
  tags: array(string()).optional(),
  isPremium: boolean().optional(),
  votes: number().optional(),
})


// image validation
const MAX_UPLOAD_SIZE = 1024 * 1024 * 3;
const ACCEPTED_FILE_TYPES = [
  'image/png',
  'image/jpeg',
  'image/jpg',
  'image/webp',
  'png',
  'jpeg',
  'jpg',
  'webp',
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
  }).optional()
});

export const voteValidationSchema = z.object({
  postId: z.string({ required_error: 'Post ID is required' }),
  userId: z.string({ required_error: 'User ID is required' }),
  voteType: z.enum(['up', 'down'], { required_error: 'Vote type is required' })
})

export const updatePostPublishStatus = z.object({
  isPublished: z.boolean({ required_error: 'Publish status is required' })
})