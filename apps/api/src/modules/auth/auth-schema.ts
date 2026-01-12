import { z } from 'zod';

export const registerSchema = z.object({
    email: z.email('Email inválido'),
    password: z.string().min(6, 'Password debe tener al menos 6 caracteres'),
    name: z.string().min(2, 'Nombre debe tener al menos 2 caracteres').optional(),
});

export const loginSchema = z.object({
    email: z.email('Email inválido'),
    password: z.string().min(1, 'Password requerido'),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;