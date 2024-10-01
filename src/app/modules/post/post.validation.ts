import { array, boolean, number, string, z } from "zod";
export const postValidationSchema = z.object({
  author: string(),
  title: string().min(1, { message: 'Title is required' }),
  content: string().min(1, { message: 'Content is required' }),
  category: z.enum(['tip', 'story']),
  tags: array(string().min(1)).nonempty({ message: 'At least one tag is required' }),
  isPremium: boolean().optional().default(false),
})

export const postUpdateValidationSchema = z.object({
  title: string().optional(),
  content: string().optional(),
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
export const ImageFileUpdateZodSchema = z.object({
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
  }).optional(),
});

export const voteValidationSchema = z.object({
  vote: z.enum(['upvote', 'downvote'], { required_error: 'Vote is required' }),
})

export const updatePostPublishStatus = z.object({
  isPublished: z.boolean({ required_error: 'Publish status is required' })
})