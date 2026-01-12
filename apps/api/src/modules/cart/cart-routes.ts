import { FastifyInstance, FastifyRequest } from 'fastify';
import { CartService } from './cart-service';
import {
  addToCartSchema,
  updateCartItemSchema,
  cartItemIdSchema,
  mergeCartSchema,
} from './cart-schema.js';

export async function cartRoutes(app: FastifyInstance) {
  const cartService = new CartService();

  // GET /api/cart - Ver carrito
  app.get('/', {
    onRequest: [app.authenticate],
  }, async (request, reply) => {
    const userId = request.user!.userId;
    const cart = await cartService.getTotal(userId);
    return cart;
  });

  // POST /api/cart/items - Agregar producto
  app.post('/items', {
    onRequest: [app.authenticate],
  }, async (request, reply) => {
    try {
      const userId = request.user!.userId;
      const data = addToCartSchema.parse(request.body);
      
      const cart = await cartService.addItem(userId, data);
      
      return reply.code(201).send(cart);
    } catch (error: any) {
      if (error.message.includes('no encontrado') || error.message.includes('insuficiente')) {
        return reply.code(400).send({ error: error.message });
      }
      throw error;
    }
  });

  // PATCH /api/cart/items/:itemId - Actualizar cantidad
  app.patch('/items/:itemId', {
    onRequest: [app.authenticate],
  }, async (request, reply) => {
    try {
      const userId = request.user!.userId;
      const { itemId } = cartItemIdSchema.parse(request.params);
      const data = updateCartItemSchema.parse(request.body);
      
      const cart = await cartService.updateItem(userId, itemId, data);
      
      return cart;
    } catch (error: any) {
      if (error.message.includes('no encontrado') || error.message.includes('insuficiente')) {
        return reply.code(400).send({ error: error.message });
      }
      throw error;
    }
  });

  // DELETE /api/cart/items/:itemId - Eliminar item
  app.delete('/items/:itemId', {
    onRequest: [app.authenticate],
  }, async (request, reply) => {
    try {
      const userId = request.user!.userId;
      const { itemId } = cartItemIdSchema.parse(request.params);
      
      const cart = await cartService.removeItem(userId, itemId);
      
      return cart;
    } catch (error: any) {
      if (error.message.includes('no encontrado')) {
        return reply.code(404).send({ error: error.message });
      }
      throw error;
    }
  });

  // DELETE /api/cart - Limpiar carrito
  app.delete('/', {
    onRequest: [app.authenticate],
  }, async (request, reply) => {
    const userId = request.user!.userId;
    const cart = await cartService.clearCart(userId);
    return cart;
  });

  // POST /api/cart/merge - Migrar carrito de localStorage
  app.post('/merge', {
    onRequest: [app.authenticate],
  }, async (request, reply) => {
    const userId = request.user!.userId;
    const data = mergeCartSchema.parse(request.body);
    
    const cart = await cartService.mergeCart(userId, data);
    
    return cart;
  });
}