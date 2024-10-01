import { z } from 'zod';

export const commentValidationSchema = z.object({
  post: z.string().min(1, 'Post ID is required'),
  commenter: z.string().min(1, 'Commenter ID is required'),
  text: z.string().min(1, 'Text is required')
});