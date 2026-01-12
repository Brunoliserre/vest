import { FastifyInstance } from 'fastify';
import { ProductService } from './product-service';
import {
    createProductSchema,
    updateProductSchema,
    productIdSchema,
    productSlugSchema,
    searchProductsSchema
} from './product-schema';

export async function productRoutes(app: FastifyInstance) {
    const productService = new ProductService();

    // GET Busqueda y filtros
    app.get('/search', async (request, reply) => {
        const filters = searchProductsSchema.parse(request.query);
        const result = await productService.search(filters);
        return result;
    });

    // GET /api/products
    app.get('/', async (request, reply) => {
        const products = await productService.findAll();
        return products;
    });

    // GET /api/products/slug/:slug - ← NUEVO
    app.get('/slug/:slug', async (request, reply) => {
        try {
            const { slug } = productSlugSchema.parse(request.params);
            const product = await productService.findBySlug(slug);
            return product;
        } catch (error: any) {
            if (error.message === 'Product not found') {
                return reply.code(404).send({ error: error.message });
            }
            throw error;
        }
    });

    // GET /api/products/:id
    app.get('/:id', async (request, reply) => {
        const { id } = productIdSchema.parse(request.params);

        try {
            const product = await productService.findById(id);
            return product;
        } catch (error) {
            return reply.code(404).send({ error: 'Product not found' });
        }
    });

    // POST /api/products (admin)
    app.post('/', {
        onRequest: [app.authenticate, app.isAdmin],
    }, async (request, reply) => {
        try {
            const data = createProductSchema.parse(request.body);
            const product = await productService.create(data);
            return reply.code(201).send(product);
        } catch (error: any) {
            if (error.message.includes('Ya existe')) {
                return reply.code(409).send({ error: error.message });
            }
            throw error;
        }
    });

    // PUT /api/products/:id (admin)
    app.put('/:id', {
        onRequest: [app.authenticate, app.isAdmin],
    }, async (request, reply) => {
        try {
            const { id } = productIdSchema.parse(request.params);
            const data = updateProductSchema.parse(request.body);

            const product = await productService.update(id, data);
            return product;
        } catch (error) {
            return reply.code(404).send({ error: 'Product not found' });
        }
    });

    // DELETE /api/products/:id (admin)
    app.delete('/:id', {
        onRequest: [app.authenticate, app.isAdmin],
    }, async (request, reply) => {
        try {
            const { id } = productIdSchema.parse(request.params);

            await productService.delete(id);
            return reply.code(204).send();
        } catch (error) {
            return reply.code(404).send({ error: 'Product not found' });
        }
    });
}