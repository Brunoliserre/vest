import { prisma } from '@ecommerce/database';
import type { CreateOrderInput, UpdateOrderStatusInput, CreateOrderItem } from './order-schema.js';

export class OrderService {
    async create(userId: string, data: CreateOrderInput) {
        // Validar que todos los productos existen y tienen stock
        const productIds = data.items.map(item => item.productId);

        const products = await prisma.product.findMany({
            where: {
                id: { in: productIds }
            }
        });

        if (products.length !== productIds.length) {
            throw new Error('Algunos productos no existen');
        }

        // Validar stock y calcular total
        let total = 0;
        const itemsWithPrice = data.items.map((item: CreateOrderItem) => {
            const product = products.find(p => p.id === item.productId);

            if (!product) {
                throw new Error(`Producto ${item.productId} no encontrado`);
            }

            if (product.stock < item.quantity) {
                throw new Error(`Stock insuficiente para ${product.name}. Disponible: ${product.stock}`);
            }

            const itemTotal = Number(product.price) * item.quantity;
            total += itemTotal;

            return {
                productId: item.productId,
                quantity: item.quantity,
                price: product.price,
            };
        });

        // Crear orden con items en una transacción
        const order = await prisma.$transaction(async (tx) => {
            // Crear la orden
            const newOrder = await tx.order.create({
                data: {
                    userId,
                    total,
                    status: 'PENDING',
                    items: {
                        create: itemsWithPrice,
                    },
                },
                include: {
                    items: {
                        include: {
                            product: true,
                        },
                    },
                },
            });

            // Reducir stock de los productos
            for (const item of data.items) {
                await tx.product.update({
                    where: { id: item.productId },
                    data: {
                        stock: {
                            decrement: item.quantity,
                        },
                    },
                });
            }

            return newOrder;
        });

        return order;
    }

    async findByUser(userId: string) {
        return await prisma.order.findMany({
            where: { userId },
            include: {
                items: {
                    include: {
                        product: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
    }

    async findById(orderId: string, userId?: string) {
        const order = await prisma.order.findUnique({
            where: { id: orderId },
            include: {
                items: {
                    include: {
                        product: true,
                    },
                },
                user: {
                    select: {
                        id: true,
                        email: true,
                        name: true,
                    },
                },
            },
        });

        if (!order) {
            throw new Error('Orden no encontrada');
        }

        // Si se provee userId, verificar que sea el dueño
        if (userId && order.userId !== userId) {
            throw new Error('No autorizado para ver esta orden');
        }

        return order;
    }

    async findAll() {
        return await prisma.order.findMany({
            include: {
                items: {
                    include: {
                        product: true,
                    },
                },
                user: {
                    select: {
                        id: true,
                        email: true,
                        name: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
    }

    async updateStatus(orderId: string, data: UpdateOrderStatusInput) {
        const order = await prisma.order.findUnique({
            where: { id: orderId },
        });

        if (!order) {
            throw new Error('Orden no encontrada');
        }

        // Si se cancela una orden PENDING, devolver el stock
        if (data.status === 'CANCELLED' && order.status === 'PENDING') {
            await prisma.$transaction(async (tx) => {
                // Obtener items de la orden
                const orderItems = await tx.orderItem.findMany({
                    where: { orderId },
                });

                // Devolver stock
                for (const item of orderItems) {
                    await tx.product.update({
                        where: { id: item.productId },
                        data: {
                            stock: {
                                increment: item.quantity,
                            },
                        },
                    });
                }

                // Actualizar estado
                await tx.order.update({
                    where: { id: orderId },
                    data: { status: data.status },
                });
            });
        } else {
            // Solo actualizar estado
            await prisma.order.update({
                where: { id: orderId },
                data: { status: data.status },
            });
        }

        return await this.findById(orderId);
    }

    async delete(orderId: string) {
        const order = await prisma.order.findUnique({
            where: { id: orderId },
        });

        if (!order) {
            throw new Error('Orden no encontrada');
        }

        // Solo se pueden eliminar órdenes PENDING
        if (order.status !== 'PENDING') {
            throw new Error('Solo se pueden eliminar órdenes pendientes');
        }

        // Devolver stock en transacción
        await prisma.$transaction(async (tx) => {
            const orderItems = await tx.orderItem.findMany({
                where: { orderId },
            });

            for (const item of orderItems) {
                await tx.product.update({
                    where: { id: item.productId },
                    data: {
                        stock: {
                            increment: item.quantity,
                        },
                    },
                });
            }

            await tx.order.delete({
                where: { id: orderId },
            });
        });

        return { message: 'Orden eliminada' };
    }
}