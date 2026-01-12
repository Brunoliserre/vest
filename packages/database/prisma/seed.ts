import { PrismaClient } from '../generated/prisma/client'
import bcrypt from 'bcrypt';

const prisma = new PrismaClient({});

async function main() {
  console.log('🌱 Iniciando seed...\n');

  // Limpiar datos existentes (opcional)
  console.log('🗑️  Limpiando datos existentes...');
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();
  console.log('✅ Datos limpiados\n');

  // ============================================
  // 1. USUARIOS
  // ============================================
  console.log('👥 Creando usuarios...');
  
  const hashedPassword = await bcrypt.hash('123456', 10);
  
  const admin = await prisma.user.create({
    data: {
      email: 'admin@test.com',
      password: hashedPassword,
      name: 'Admin',
      role: 'ADMIN',
    },
  });

  const users = await Promise.all([
    prisma.user.create({
      data: {
        email: 'bruno@test.com',
        password: hashedPassword,
        name: 'Bruno García',
        role: 'CUSTOMER',
      },
    }),
    prisma.user.create({
      data: {
        email: 'maria@test.com',
        password: hashedPassword,
        name: 'María López',
        role: 'CUSTOMER',
      },
    }),
    prisma.user.create({
      data: {
        email: 'juan@test.com',
        password: hashedPassword,
        name: 'Juan Pérez',
        role: 'CUSTOMER',
      },
    }),
  ]);

  console.log(`✅ ${users.length + 1} usuarios creados\n`);

  // ============================================
  // 2. CATEGORÍAS
  // ============================================
  console.log('🏷️  Creando categorías...');

  const categories = await Promise.all([
    prisma.category.create({
      data: {
        name: 'Electrónica',
        slug: 'electronica',
        description: 'Dispositivos y accesorios electrónicos',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Hogar y Jardín',
        slug: 'hogar-y-jardin',
        description: 'Artículos para el hogar y jardín',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Deportes',
        slug: 'deportes',
        description: 'Equipamiento y ropa deportiva',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Libros',
        slug: 'libros',
        description: 'Libros de diversos géneros',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Juguetes',
        slug: 'juguetes',
        description: 'Juguetes para todas las edades',
      },
    }),
  ]);

  console.log(`✅ ${categories.length} categorías creadas\n`);

  // ============================================
  // 3. PRODUCTOS
  // ============================================
  console.log('📦 Creando productos...');

  const electronicsCategory = categories[0];
  const homeCategory = categories[1];
  const sportsCategory = categories[2];
  const booksCategory = categories[3];
  const toysCategory = categories[4];

  const products = await Promise.all([
    // Electrónica
    prisma.product.create({
      data: {
        name: 'Mouse Logitech G502 Hero',
        slug: 'mouse-logitech-g502-hero',
        description: 'Mouse gaming con sensor HERO 25K, 11 botones programables y RGB personalizable',
        price: 25000,
        stock: 15,
        imageUrl: 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=800',
        categoryId: electronicsCategory.id,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Teclado Mecánico Redragon K552',
        slug: 'teclado-mecanico-redragon-k552',
        description: 'Teclado mecánico 60% con switches blue, retroiluminación RGB',
        price: 35000,
        stock: 20,
        imageUrl: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800',
        categoryId: electronicsCategory.id,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Auriculares HyperX Cloud II',
        slug: 'auriculares-hyperx-cloud-ii',
        description: 'Auriculares gaming con sonido surround 7.1, micrófono desmontable',
        price: 45000,
        stock: 12,
        imageUrl: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800',
        categoryId: electronicsCategory.id,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Webcam Logitech C920',
        slug: 'webcam-logitech-c920',
        description: 'Webcam Full HD 1080p con micrófono estéreo integrado',
        price: 38000,
        stock: 8,
        imageUrl: 'https://images.unsplash.com/photo-1585792180666-f7347c490ee2?w=800',
        categoryId: electronicsCategory.id,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Monitor Samsung 24" Full HD',
        slug: 'monitor-samsung-24-full-hd',
        description: 'Monitor LED 24 pulgadas, 75Hz, tiempo de respuesta 5ms',
        price: 85000,
        stock: 5,
        imageUrl: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800',
        categoryId: electronicsCategory.id,
      },
    }),

    // Hogar
    prisma.product.create({
      data: {
        name: 'Cafetera Nespresso Essenza Mini',
        slug: 'cafetera-nespresso-essenza-mini',
        description: 'Cafetera de cápsulas compacta, 19 bares de presión',
        price: 55000,
        stock: 10,
        imageUrl: 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=800',
        categoryId: homeCategory.id,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Aspiradora Robot Xiaomi',
        slug: 'aspiradora-robot-xiaomi',
        description: 'Robot aspirador inteligente con mapeo láser y control por app',
        price: 120000,
        stock: 6,
        imageUrl: 'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=800',
        categoryId: homeCategory.id,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Set de Sartenes Antiadherentes',
        slug: 'set-de-sartenes-antiadherentes',
        description: 'Set de 3 sartenes con recubrimiento cerámico antiadherente',
        price: 28000,
        stock: 15,
        imageUrl: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800',
        categoryId: homeCategory.id,
      },
    }),

    // Deportes
    prisma.product.create({
      data: {
        name: 'Pelota de Fútbol Adidas',
        slug: 'pelota-de-futbol-adidas',
        description: 'Pelota oficial talla 5, diseño Champions League',
        price: 18000,
        stock: 25,
        imageUrl: 'https://images.unsplash.com/photo-1614632537423-1e6c2e7e0aac?w=800',
        categoryId: sportsCategory.id,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Colchoneta de Yoga Premium',
        slug: 'colchoneta-de-yoga-premium',
        description: 'Colchoneta antideslizante 6mm de grosor con bolso incluido',
        price: 15000,
        stock: 18,
        imageUrl: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=800',
        categoryId: sportsCategory.id,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Mancuernas Ajustables 20kg',
        slug: 'mancuernas-ajustables-20kg',
        description: 'Par de mancuernas ajustables de 2.5 a 20kg cada una',
        price: 42000,
        stock: 10,
        imageUrl: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800',
        categoryId: sportsCategory.id,
      },
    }),

    // Libros
    prisma.product.create({
      data: {
        name: 'El Señor de los Anillos - Trilogía',
        slug: 'el-senor-de-los-anillos-trilogia',
        description: 'Edición completa de la trilogía de J.R.R. Tolkien',
        price: 12000,
        stock: 30,
        imageUrl: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800',
        categoryId: booksCategory.id,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Cien Años de Soledad',
        slug: 'cien-anos-de-soledad',
        description: 'Obra maestra de Gabriel García Márquez',
        price: 8500,
        stock: 20,
        imageUrl: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800',
        categoryId: booksCategory.id,
      },
    }),

    // Juguetes
    prisma.product.create({
      data: {
        name: 'LEGO Star Wars Millennium Falcon',
        slug: 'lego-star-wars-millennium-falcon',
        description: 'Set de construcción con 1351 piezas, incluye 7 minifiguras',
        price: 95000,
        stock: 8,
        imageUrl: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=800',
        categoryId: toysCategory.id,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Cubo Rubik 3x3 Original',
        slug: 'cubo-rubik-3x3-original',
        description: 'Cubo mágico oficial con mecanismo mejorado',
        price: 5500,
        stock: 40,
        imageUrl: 'https://images.unsplash.com/photo-1591991731833-b14a58c0a701?w=800',
        categoryId: toysCategory.id,
      },
    }),
  ]);

  console.log(`✅ ${products.length} productos creados\n`);

  // ============================================
  // 4. ÓRDENES
  // ============================================
  console.log('🛒 Creando órdenes de ejemplo...');

  // Orden 1: Bruno - Pendiente
  await prisma.order.create({
    data: {
      userId: users[0].id,
      status: 'PENDING',
      total: 60000,
      items: {
        create: [
          {
            productId: products[0].id, // Mouse
            quantity: 1,
            price: 25000,
          },
          {
            productId: products[1].id, // Teclado
            quantity: 1,
            price: 35000,
          },
        ],
      },
    },
  });

  // Orden 2: María - Pagada
  await prisma.order.create({
    data: {
      userId: users[1].id,
      status: 'PAID',
      total: 12000,
      items: {
        create: [
          {
            productId: products[11].id, // Señor de los Anillos
            quantity: 1,
            price: 12000,
          },
        ],
      },
    },
  });

  // Orden 3: Juan - Enviada
  await prisma.order.create({
    data: {
      userId: users[2].id,
      status: 'SHIPPED',
      total: 130000,
      items: {
        create: [
          {
            productId: products[4].id, // Monitor
            quantity: 1,
            price: 85000,
          },
          {
            productId: products[2].id, // Auriculares
            quantity: 1,
            price: 45000,
          },
        ],
      },
    },
  });

  // Orden 4: Bruno - Entregada
  await prisma.order.create({
    data: {
      userId: users[0].id,
      status: 'DELIVERED',
      total: 18000,
      items: {
        create: [
          {
            productId: products[8].id, // Pelota de fútbol
            quantity: 1,
            price: 18000,
          },
        ],
      },
    },
  });

  console.log('✅ 4 órdenes creadas\n');

  // ============================================
  // RESUMEN
  // ============================================
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🎉 Seed completado exitosamente!\n');
  console.log('📊 Resumen:');
  console.log(`   👥 Usuarios: ${users.length + 1} (1 admin + ${users.length} customers)`);
  console.log(`   🏷️  Categorías: ${categories.length}`);
  console.log(`   📦 Productos: ${products.length}`);
  console.log(`   🛒 Órdenes: 4`);
  console.log('\n🔐 Credenciales:');
  console.log('   Admin:');
  console.log('   📧 Email: admin@test.com');
  console.log('   🔒 Password: 123456\n');
  console.log('   Customers:');
  console.log('   📧 bruno@test.com / 123456');
  console.log('   📧 maria@test.com / 123456');
  console.log('   📧 juan@test.com / 123456');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
}

main()
  .catch((e) => {
    console.error('❌ Error en seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });