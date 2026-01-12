import { prisma } from '@ecommerce/database';
import bcrypt from 'bcrypt';
import { signToken } from '../lib/jwt.js';

async function createAdmin() {
  const email = 'admin@test.com';
  const password = 'admin123';
  const name = 'Admin';

  // Verificar si ya existe
  const existing = await prisma.user.findUnique({
    where: { email },
  });

  if (existing) {
    console.log('❌ El usuario ya existe');
    
    // Generar token para el usuario existente
    const token = signToken({
      userId: existing.id,
      email: existing.email,
      role: existing.role,
    });
    
    console.log('\n✅ Token generado:');
    console.log(token);
    console.log('\n📋 Copiar para usar en REST Client:');
    console.log(`@token = ${token}`);
    
    return;
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Crear usuario admin
  const admin = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
      role: 'ADMIN',
    },
  });

  // Generar token
  const token = signToken({
    userId: admin.id,
    email: admin.email,
    role: admin.role,
  });

  console.log('✅ Admin creado exitosamente!');
  console.log('\n📧 Email:', email);
  console.log('🔒 Password:', password);
  console.log('👤 Rol:', admin.role);
  console.log('\n🎟️  Token JWT:');
  console.log(token);
  console.log('\n📋 Copiar para usar en REST Client:');
  console.log(`@token = ${token}`);
}

createAdmin()
  .catch(console.error)
  .finally(() => prisma.$disconnect());