import bcrypt from 'bcrypt';
import { prisma } from '@ecommerce/database';
import { signToken } from '../../lib/jwt.js';
import type { RegisterInput, LoginInput } from './auth-schema.js';

export class AuthService {
    private readonly SALT_ROUNDS = 10;

    async register(data: RegisterInput) {
        // Verificar si el email ya existe
        const existingUser = await prisma.user.findUnique({
            where: { email: data.email },
        });

        if (existingUser) {
            throw new Error('Email already registered');
        }

        // Hash del password
        const hashedPassword = await bcrypt.hash(data.password, this.SALT_ROUNDS);

        // Crear usuario
        const user = await prisma.user.create({
            data: {
                email: data.email,
                password: hashedPassword,
                name: data.name,
            },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                createdAt: true,
            },
        });

        // Generar token
        const token = signToken({
            userId: user.id,
            email: user.email,
            role: user.role,
        });

        return {
            user,
            token,
        };
    }

    async login(data: LoginInput) {
        // Buscar usuario
        const user = await prisma.user.findUnique({
            where: { email: data.email },
        });

        if (!user) {
            throw new Error('Invalid credentials');
        }

        // Verificar password
        const isPasswordValid = await bcrypt.compare(data.password, user.password);

        if (!isPasswordValid) {
            throw new Error('Invalid credentials');
        }

        // Generar token
        const token = signToken({
            userId: user.id,
            email: user.email,
            role: user.role,
        });

        return {
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
            },
            token,
        };
    }

    async me(userId: string) {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                createdAt: true,
            },
        });

        if (!user) {
            throw new Error('User not found');
        }

        return user;
    }
}