import { z } from 'zod';

import { ERole } from '@/types/user';

export const registrationSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, { message: 'Full name must contain at least 2 characters' })
      .max(100, { message: 'Password must be at most 100 characters' }),
    email: z.email('Invalid email').trim().min(1, { message: 'Email is required' }),
    role: z.enum([ERole.ENGINEER, ERole.ADMIN]),
    password: z
      .string()
      .trim()
      .min(6, { message: 'Password must be at least 6 characters' })
      .max(15, { message: 'Password must be at most 15 characters' })
      .regex(/^(?=.*[A-Za-z0-9])(?=.*\d)[A-Za-z\d!@#$%^&*()_+-,]{6,15}$/, {
        message:
          'Password must contain only Latin letters, numbers and be at least 6 characters long.',
      }),

    confirmPassword: z.string().trim().min(1, { message: 'Please confirm your password' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type RegistrationSchema = z.infer<typeof registrationSchema>;
