import { z } from 'zod';

// Helper para generar slug desde el nombre
export function generateSlug(name: string): string {
    return name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Quitar acentos
        .replace(/[^a-z0-9\s-]/g, '') // Quitar caracteres especiales
        .trim()
        .replace(/\s+/g, '-') // Espacios a guiones
        .replace(/-+/g, '-'); // Guiones múltiples a uno
}

export const createCategorySchema = z.object({
    name: z.string().min(2).max(100),
    description: z.string().optional(),
});

export const updateCategorySchema = createCategorySchema.partial();

export const categoryIdSchema = z.object({
    id: z.string().uuid(),
});

export const categorySlugSchema = z.object({
    slug: z.string().min(2),
});

export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;