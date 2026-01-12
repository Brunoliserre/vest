import { FastifyInstance, FastifyRequest } from 'fastify';
import { OrderService } from './order-service.js';
import {
    createOrderSchema,
    updateOrderStatusSchema,
    orderIdSchema,
} from './order-schema.js';

export async function orderRoutes(app: FastifyInstance) {
    const orderService = new OrderService();

    // POST /api/orders - Crear orden (requiere auth)
    app.post('/', {
        onRequest: [app.authenticate],
    }, async (request: FastifyRequest, reply) => {
        try {
            const data = createOrderSchema.parse(request.body);
            const userId = request.user!.userId;

            const order = await orderService.create(userId, data);

            return reply.code(201).send(order);
        } catch (error: any) {
            if (error.message.includes('Stock insuficiente') ||
                error.message.includes('no existen')) {
                return reply.code(400).send({ error: error.message });
            }
            throw error;
        }
    });

    // GET /api/orders - Ver mis órdenes (requiere auth)
    app.get('/', {
        onRequest: [app.authenticate],
    }, async (request: FastifyRequest, reply) => {
        const userId = request.user!.userId;
        const orders = await orderService.findByUser(userId);

        return orders;
    });

    // GET /api/orders/all - Ver todas las órdenes (solo admin)
    app.get('/all', {
        onRequest: [app.authenticate, app.isAdmin],
    }, async (request, reply) => {
        const orders = await orderService.findAll();

        return orders;
    });

    // GET /api/orders/:id - Ver orden específica
    app.get('/:id', {
        onRequest: [app.authenticate],
    }, async (request: FastifyRequest, reply) => {
        try {
            const { id } = orderIdSchema.parse(request.params);
            const userId = request.user!.userId;
            const isAdmin = request.user!.role === 'ADMIN';

            // Admin puede ver cualquier orden, usuario solo las suyas
            const order = await orderService.findById(
                id,
                isAdmin ? undefined : userId
            );

            return order;
        } catch (error: any) {
            if (error.message === 'Orden no encontrada') {
                return reply.code(404).send({ error: error.message });
            }
            if (error.message === 'No autorizado para ver esta orden') {
                return reply.code(403).send({ error: error.message });
            }
            throw error;
        }
    });

    // PATCH /api/orders/:id/status - Actualizar estado (solo admin)
    app.patch('/:id/status', {
        onRequest: [app.authenticate, app.isAdmin],
    }, async (request, reply) => {
        try {
            const { id } = orderIdSchema.parse(request.params);
            const data = updateOrderStatusSchema.parse(request.body);

            const order = await orderService.updateStatus(id, data);

            return order;
        } catch (error: any) {
            if (error.message === 'Orden no encontrada') {
                return reply.code(404).send({ error: error.message });
            }
            throw error;
        }
    });

    // DELETE /api/orders/:id - Eliminar orden (solo admin)
    app.delete('/:id', {
        onRequest: [app.authenticate, app.isAdmin],
    }, async (request, reply) => {
        try {
            const { id } = orderIdSchema.parse(request.params);

            const result = await orderService.delete(id);

            return reply.code(200).send(result);
        } catch (error: any) {
            if (error.message === 'Orden no encontrada') {
                return reply.code(404).send({ error: error.message });
            }
            if (error.message.includes('Solo se pueden eliminar')) {
                return reply.code(400).send({ error: error.message });
            }
            throw error;
        }
    });
}