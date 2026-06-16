import { z } from 'zod';

export const loginSchema = z.object({
  email: z.email('Invalid email').trim().min(1, { message: 'Email is required' }),
  password: z.string().trim().min(1, { message: 'Password is required' }),
});

export type LoginSchema = z.infer<typeof loginSchema>;
