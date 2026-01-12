import { prisma } from '@ecommerce/database';
import { generateSlug } from './category-schema.js';
import type { CreateCategoryInput, UpdateCategoryInput } from './category-schema.js';

export class CategoryService {
    async findAll() {
        return await prisma.category.findMany({
            include: {
                _count: {
                    select: { products: true },
                },
            },
            orderBy: {
                name: 'asc',
            },
        });
    }

    async findById(id: string) {
        const category = await prisma.category.findUnique({
            where: { id },
            include: {
                products: {
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
        });

        if (!category) {
            throw new Error('Categoría no encontrada');
        }

        return category;
    }

    async findBySlug(slug: string) {
        const category = await prisma.category.findUnique({
            where: { slug },
            include: {
                products: {
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
        });

        if (!category) {
            throw new Error('Categoría no encontrada');
        }

        return category;
    }

    async create(data: CreateCategoryInput) {
        const slug = generateSlug(data.name);

        // Verificar que no exista
        const existing = await prisma.category.findUnique({
            where: { slug },
        });

        if (existing) {
            throw new Error('Ya existe una categoría con ese nombre');
        }

        return await prisma.category.create({
            data: {
                name: data.name,
                slug,
                description: data.description,
            },
        });
    }

    async update(id: string, data: UpdateCategoryInput) {
        const category = await prisma.category.findUnique({
            where: { id },
        });

        if (!category) {
            throw new Error('Categoría no encontrada');
        }

        const updateData: any = {
            ...data,
        };

        // Si se cambió el nombre, regenerar slug
        if (data.name) {
            updateData.slug = generateSlug(data.name);
        }

        return await prisma.category.update({
            where: { id },
            data: updateData,
        });
    }

    async delete(id: string) {
        const category = await prisma.category.findUnique({
            where: { id },
            include: {
                _count: {
                    select: { products: true },
                },
            },
        });

        if (!category) {
            throw new Error('Categoría no encontrada');
        }

        if (category._count.products > 0) {
            throw new Error(
                `No se puede eliminar. Hay ${category._count.products} productos en esta categoría`
            );
        }

        await prisma.category.delete({
            where: { id },
        });

        return { message: 'Categoría eliminada' };
    }
}