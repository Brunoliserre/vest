import { z } from 'zod';

export const createOrderItemSchema = z.object({
    productId: z.uuid(),
    quantity: z.number().int().positive(),
});

export const createOrderSchema = z.object({
    items: z.array(createOrderItemSchema).min(1, 'Orden debe tener al menos 1 item'),
});

export const updateOrderStatusSchema = z.object({
    status: z.enum(['PENDING', 'PAID', 'SHIPPED', 'DELIVERED', 'CANCELLED']),
});

export const orderIdSchema = z.object({
    id: z.uuid(),
});

export type CreateOrderItem = z.infer<typeof createOrderItemSchema>;
export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>;