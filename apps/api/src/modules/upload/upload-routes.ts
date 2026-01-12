import { FastifyInstance } from 'fastify';
import { uploadImage } from '../../lib/cloudinary.js';

export async function uploadRoutes(app: FastifyInstance) {
    // POST /api/upload/image - Subir imagen (requiere auth)
    app.post('/image', {
        onRequest: [app.authenticate],
    }, async (request, reply) => {
        try {
            // Obtener archivo del multipart
            const data = await request.file();

            if (!data) {
                return reply.code(400).send({ error: 'No se envió ningún archivo' });
            }

            // Validar tipo de archivo
            const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
            if (!allowedMimeTypes.includes(data.mimetype)) {
                return reply.code(400).send({
                    error: 'Tipo de archivo no permitido. Solo JPEG, PNG, WebP y GIF'
                });
            }

            // Validar tamaño (5MB máximo)
            const MAX_SIZE = 5 * 1024 * 1024; // 5MB
            const buffer = await data.toBuffer();

            if (buffer.length > MAX_SIZE) {
                return reply.code(400).send({
                    error: 'El archivo es muy grande. Máximo 5MB'
                });
            }

            // Subir a Cloudinary
            const imageUrl = await uploadImage(buffer, 'products');

            return reply.send({
                url: imageUrl,
                message: 'Imagen subida exitosamente'
            });
        } catch (error: any) {
            app.log.error(error);
            return reply.code(500).send({
                error: 'Error al subir la imagen',
                details: error.message
            });
        }
    });

    // POST /api/upload/product-image - Subir y asignar a producto (admin)
    app.post('/product-image/:productId', {
        onRequest: [app.authenticate, app.isAdmin],
    }, async (request, reply) => {
        try {
            const { productId } = request.params as { productId: string };

            // Obtener archivo
            const data = await request.file();
            if (!data) {
                return reply.code(400).send({ error: 'No se envió ningún archivo' });
            }

            // Validaciones
            const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
            if (!allowedMimeTypes.includes(data.mimetype)) {
                return reply.code(400).send({
                    error: 'Tipo de archivo no permitido'
                });
            }

            const buffer = await data.toBuffer();
            const MAX_SIZE = 5 * 1024 * 1024;
            if (buffer.length > MAX_SIZE) {
                return reply.code(400).send({ error: 'Archivo muy grande (máx 5MB)' });
            }

            // Subir imagen
            const imageUrl = await uploadImage(buffer, 'products');

            // Actualizar producto
            const { prisma } = await import('@ecommerce/database');
            const product = await prisma.product.update({
                where: { id: productId },
                data: { imageUrl },
                include: { category: true },
            });

            return reply.send({
                product,
                message: 'Imagen actualizada exitosamente'
            });
        } catch (error: any) {
            app.log.error(error);

            if (error.code === 'P2025') {
                return reply.code(404).send({ error: 'Producto no encontrado' });
            }

            return reply.code(500).send({
                error: 'Error al subir la imagen',
                details: error.message
            });
        }
    });
}