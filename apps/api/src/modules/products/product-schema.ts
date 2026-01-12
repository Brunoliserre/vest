import { z } from 'zod';

export function generateSlug(name: string): string {
    return name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');
}

export const createProductSchema = z.object({
    name: z.string().min(1).max(200),
    description: z.string().optional(),
    price: z.number().positive(),
    stock: z.number().int().min(0),
    imageUrl: z.string().url().optional(),
    categoryId: z.string().uuid().optional(), // ← NUEVO
});

export const searchProductsSchema = z.object({
    search: z.string().optional(),
    categoryId: z.uuid().optional(),
    minPrice: z.coerce.number().positive().optional(),
    maxPrice: z.coerce.number().positive().optional(),
    sortBy: z.enum(['name', 'price', 'createdAt']).optional().default('createdAt'),
    sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
    page: z.coerce.number().int().positive().optional().default(1),
    limit: z.coerce.number().int().positive().max(100).optional().default(20),
});

export const updateProductSchema = createProductSchema.partial();

export const productIdSchema = z.object({
    id: z.string().uuid(),
});

export const productSlugSchema = z.object({
    slug: z.string().min(2),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
export type SearchProductsInput = z.infer<typeof searchProductsSchema>;