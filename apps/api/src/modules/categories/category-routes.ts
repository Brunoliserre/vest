import { FastifyInstance } from 'fastify';
import { CategoryService } from './category-service.js';
import {
    createCategorySchema,
    updateCategorySchema,
    categoryIdSchema,
    categorySlugSchema,
} from './category-schema.js';

export async function categoryRoutes(app: FastifyInstance) {
    const categoryService = new CategoryService();

    // GET /api/categories - Listar categorías (público)
    app.get('/', async (request, reply) => {
        const categories = await categoryService.findAll();
        return categories;
    });

    // GET /api/categories/:id - Ver por ID
    app.get('/:id', async (request, reply) => {
        try {
            const { id } = categoryIdSchema.parse(request.params);
            const category = await categoryService.findById(id);
            return category;
        } catch (error: any) {
            if (error.message === 'Categoría no encontrada') {
                return reply.code(404).send({ error: error.message });
            }
            throw error;
        }
    });

    // GET /api/categories/slug/:slug - Ver por slug
    app.get('/slug/:slug', async (request, reply) => {
        try {
            const { slug } = categorySlugSchema.parse(request.params);
            const category = await categoryService.findBySlug(slug);
            return category;
        } catch (error: any) {
            if (error.message === 'Categoría no encontrada') {
                return reply.code(404).send({ error: error.message });
            }
            throw error;
        }
    });

    // POST /api/categories - Crear (solo admin)
    app.post('/', {
        onRequest: [app.authenticate, app.isAdmin],
    }, async (request, reply) => {
        try {
            const data = createCategorySchema.parse(request.body);
            const category = await categoryService.create(data);
            return reply.code(201).send(category);
        } catch (error: any) {
            if (error.message.includes('Ya existe')) {
                return reply.code(409).send({ error: error.message });
            }
            throw error;
        }
    });

    // PUT /api/categories/:id - Actualizar (solo admin)
    app.put('/:id', {
        onRequest: [app.authenticate, app.isAdmin],
    }, async (request, reply) => {
        try {
            const { id } = categoryIdSchema.parse(request.params);
            const data = updateCategorySchema.parse(request.body);
            const category = await categoryService.update(id, data);
            return category;
        } catch (error: any) {
            if (error.message === 'Categoría no encontrada') {
                return reply.code(404).send({ error: error.message });
            }
            throw error;
        }
    });

    // DELETE /api/categories/:id - Eliminar (solo admin)
    app.delete('/:id', {
        onRequest: [app.authenticate, app.isAdmin],
    }, async (request, reply) => {
        try {
            const { id } = categoryIdSchema.parse(request.params);
            const result = await categoryService.delete(id);
            return reply.code(200).send(result);
        } catch (error: any) {
            if (error.message === 'Categoría no encontrada') {
                return reply.code(404).send({ error: error.message });
            }
            if (error.message.includes('No se puede eliminar')) {
                return reply.code(400).send({ error: error.message });
            }
            throw error;
        }
    });
}