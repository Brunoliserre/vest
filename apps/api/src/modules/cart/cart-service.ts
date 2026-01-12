import { prisma } from '@ecommerce/database';
import type { AddToCartInput, UpdateCartItemInput, MergeCartInput } from './cart-schema.js';

export class CartService {
    // Obtener o crear carrito del usuario
    async getOrCreateCart(userId: string) {
        let cart = await prisma.cart.findUnique({
            where: { userId },
            include: {
                items: {
                    include: {
                        product: {
                            select: {
                                id: true,
                                name: true,
                                slug: true,
                                price: true,
                                stock: true,
                                imageUrl: true,
                            },
                        },
                    },
                },
            },
        });

        if (!cart) {
            cart = await prisma.cart.create({
                data: { userId },
                include: {
                    items: {
                        include: {
                            product: {
                                select: {
                                    id: true,
                                    name: true,
                                    slug: true,
                                    price: true,
                                    stock: true,
                                    imageUrl: true,
                                },
                            },
                        },
                    },
                },
            });
        }

        return cart;
    }

    // Agregar producto al carrito
    async addItem(userId: string, data: AddToCartInput) {
        const cart = await this.getOrCreateCart(userId);

        // Verificar que el producto existe y tiene stock
        const product = await prisma.product.findUnique({
            where: { id: data.productId },
        });

        if (!product) {
            throw new Error('Producto no encontrado');
        }

        if (product.stock < data.quantity) {
            throw new Error(`Stock insuficiente. Disponible: ${product.stock}`);
        }

        // Verificar si ya existe en el carrito
        const existingItem = await prisma.cartItem.findUnique({
            where: {
                cartId_productId: {
                    cartId: cart.id,
                    productId: data.productId,
                },
            },
        });

        if (existingItem) {
            // Actualizar cantidad
            const newQuantity = existingItem.quantity + data.quantity;

            if (newQuantity > product.stock) {
                throw new Error(`Stock insuficiente. Disponible: ${product.stock}`);
            }

            await prisma.cartItem.update({
                where: { id: existingItem.id },
                data: { quantity: newQuantity },
            });
        } else {
            // Crear nuevo item
            await prisma.cartItem.create({
                data: {
                    cartId: cart.id,
                    productId: data.productId,
                    quantity: data.quantity,
                },
            });
        }

        return await this.getOrCreateCart(userId);
    }

    // Actualizar cantidad de un item
    async updateItem(userId: string, itemId: string, data: UpdateCartItemInput) {
        const cart = await this.getOrCreateCart(userId);

        const item = await prisma.cartItem.findFirst({
            where: {
                id: itemId,
                cartId: cart.id,
            },
            include: {
                product: true,
            },
        });

        if (!item) {
            throw new Error('Item no encontrado en el carrito');
        }

        // Si quantity es 0, eliminar
        if (data.quantity === 0) {
            await prisma.cartItem.delete({
                where: { id: itemId },
            });
        } else {
            // Verificar stock
            if (data.quantity > item.product.stock) {
                throw new Error(`Stock insuficiente. Disponible: ${item.product.stock}`);
            }

            await prisma.cartItem.update({
                where: { id: itemId },
                data: { quantity: data.quantity },
            });
        }

        return await this.getOrCreateCart(userId);
    }

    // Eliminar item del carrito
    async removeItem(userId: string, itemId: string) {
        const cart = await this.getOrCreateCart(userId);

        const item = await prisma.cartItem.findFirst({
            where: {
                id: itemId,
                cartId: cart.id,
            },
        });

        if (!item) {
            throw new Error('Item no encontrado en el carrito');
        }

        await prisma.cartItem.delete({
            where: { id: itemId },
        });

        return await this.getOrCreateCart(userId);
    }

    // Limpiar carrito
    async clearCart(userId: string) {
        const cart = await this.getOrCreateCart(userId);

        await prisma.cartItem.deleteMany({
            where: { cartId: cart.id },
        });

        return await this.getOrCreateCart(userId);
    }

    // Migrar carrito de localStorage (al hacer login)
    async mergeCart(userId: string, data: MergeCartInput) {
        const cart = await this.getOrCreateCart(userId);

        for (const item of data.items) {
            try {
                await this.addItem(userId, item);
            } catch (error) {
                // Si falla un item, continuar con los demás
                console.error(`Error al migrar item ${item.productId}:`, error);
            }
        }

        return await this.getOrCreateCart(userId);
    }

    // Obtener total del carrito
    async getTotal(userId: string) {
        const cart = await this.getOrCreateCart(userId);

        const total = cart.items.reduce((sum, item) => {
            return sum + Number(item.product.price) * item.quantity;
        }, 0);

        return {
            ...cart,
            total,
            itemCount: cart.items.reduce((sum, item) => sum + item.quantity, 0),
        };
    }
}