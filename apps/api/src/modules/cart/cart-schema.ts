import { z } from 'zod';

export const addToCartSchema = z.object({
    productId: z.uuid(),
    quantity: z.number().int().positive().max(100),
});

export const updateCartItemSchema = z.object({
    quantity: z.number().int().min(0).max(100),
});

export const cartItemIdSchema = z.object({
    itemId: z.uuid(),
});

export const mergeCartSchema = z.object({
    items: z.array(
        z.object({
            productId: z.uuid(),
            quantity: z.number().int().positive(),
        })
    ),
});

export type AddToCartInput = z.infer<typeof addToCartSchema>;
export type UpdateCartItemInput = z.infer<typeof updateCartItemSchema>;
export type MergeCartInput = z.infer<typeof mergeCartSchema>;