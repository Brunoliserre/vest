import Fastify from "fastify";
import cors from "@fastify/cors";
import jwt from "@fastify/jwt";
import cookie from "@fastify/cookie";
import multipart from "@fastify/multipart";

import { productRoutes } from "./modules/products/product-routes";
import { orderRoutes } from "./modules/orders/order-routes";
import { categoryRoutes } from "./modules/categories/category-routes";
import { uploadRoutes } from "./modules/upload/upload-routes";
import { authRoutes } from "./modules/auth/auth-routes";
import { authenticate, isAdmin } from "./middleware/auth";

export const app = Fastify({
    logger: true
});

// Plugins
await app.register(cors, {
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true
});

await app.register(jwt, {
    secret: process.env.JWT_SECRET || 'supersecret'
});

await app.register(cookie);
await app.register(multipart);

// Middleware
app.decorate('authenticate', authenticate);
app.decorate('isAdmin', isAdmin);

// Health check
app.get('/health', async () => {
    return { status: 'ok' };
});

// Rutas de módulos
await app.register(productRoutes, { prefix: '/api/products' });
await app.register(orderRoutes, { prefix: '/api/orders' });
await app.register(categoryRoutes, { prefix: '/api/categories' });
await app.register(uploadRoutes, { prefix: '/api/upload' });
await app.register(authRoutes, { prefix: '/api/auth' });

// Error handler global
app.setErrorHandler((error, request, reply) => {
    app.log.error(error);

    // Error de validación Zod
    if (error && typeof error === 'object' && 'name' in error && error.name === 'ZodError') {
        return reply.code(400).send({
            error: 'Validation error',
            details: 'issues' in error ? error.issues : [],
        });
    }

    // Error genérico
    return reply.code(500).send({
        error: 'Internal server error',
    });
});