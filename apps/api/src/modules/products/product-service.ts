import { prisma } from '@ecommerce/database';
import { generateSlug } from './product-schema.js';
import { deleteImage, getPublicIdFromUrl } from '../../lib/cloudinary.js';
import type { CreateProductInput, UpdateProductInput, SearchProductsInput } from './product-schema.js';

export class ProductService {
  async search(filters: SearchProductsInput) {
    const {
      search,
      categoryId,
      minPrice,
      maxPrice,
      sortBy,
      sortOrder,
      page,
      limit,
    } = filters;

    // Construir condiciones WHERE
    const where: any = {};

    // Búsqueda por texto (nombre o descripción)
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Filtro por categoría
    if (categoryId) {
      where.categoryId = categoryId;
    }

    // Filtro por rango de precio
    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {};
      if (minPrice !== undefined) {
        where.price.gte = minPrice;
      }
      if (maxPrice !== undefined) {
        where.price.lte = maxPrice;
      }
    }

    // Calcular paginación
    const skip = (page - 1) * limit;

    // Ejecutar query con paginación
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          category: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
        },
        orderBy: {
          [sortBy]: sortOrder,
        },
        skip,
        take: limit,
      }),
      prisma.product.count({ where }),
    ]);

    // Calcular metadatos de paginación
    const totalPages = Math.ceil(total / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    return {
      data: products,
      pagination: {
        total,
        page,
        limit,
        totalPages,
        hasNextPage,
        hasPrevPage,
      },
    };
  }

  async findAll() {
    return await prisma.product.findMany({
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id: string) {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
      },
    });

    if (!product) {
      throw new Error('Product not found');
    }

    return product;
  }

  async findBySlug(slug: string) {
    const product = await prisma.product.findUnique({
      where: { slug },
      include: {
        category: true,
      },
    });

    if (!product) {
      throw new Error('Product not found');
    }

    return product;
  }

  async create(data: CreateProductInput) {
    const slug = generateSlug(data.name);

    // Verificar que el slug no exista
    const existing = await prisma.product.findUnique({
      where: { slug },
    });

    if (existing) {
      throw new Error('Ya existe un producto con ese nombre');
    }

    return await prisma.product.create({
      data: {
        ...data,
        slug,
      },
      include: {
        category: true,
      },
    });
  }

  async update(id: string, data: UpdateProductInput) {
    const updateData: any = { ...data };

    // Si se cambia el nombre, regenerar slug
    if (data.name) {
      updateData.slug = generateSlug(data.name);
    }

    return await prisma.product.update({
      where: { id },
      data: updateData,
      include: {
        category: true,
      },
    });
  }

  async delete(id: string) {
    // Obtener producto para borrar imagen de Cloudinary
    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new Error('Product not found');
    }

    // Si tiene imagen en Cloudinary, borrarla
    if (product.imageUrl && product.imageUrl.includes('cloudinary.com')) {
      const publicId = getPublicIdFromUrl(product.imageUrl);
      if (publicId) {
        try {
          await deleteImage(publicId);
        } catch (error) {
          console.error('Error al borrar imagen de Cloudinary:', error);
          // No fallar si no se puede borrar la imagen
        }
      }
    }

    return await prisma.product.delete({
      where: { id },
    });
  }
}