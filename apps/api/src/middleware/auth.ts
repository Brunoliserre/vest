import { FastifyRequest, FastifyReply } from 'fastify';
import { verifyToken } from '../lib/jwt.js';

export async function authenticate(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return reply.code(401).send({ error: 'No token provided' });
    }

    const token = authHeader.substring(7); // Quitar "Bearer "
    const payload = verifyToken(token);

    // Agregar user al request
    (request as any).user = payload;
  } catch (error) {
    return reply.code(401).send({ error: 'Invalid token' });
  }
}

export async function isAdmin(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const user = (request as any).user;

  if (!user || user.role !== 'ADMIN') {
    return reply.code(403).send({ error: 'Admin access required' });
  }
}