import { FastifyInstance, FastifyRequest } from 'fastify';
import { AuthService } from './auth-service.js';
import { registerSchema, loginSchema } from './auth-schema.js';

export async function authRoutes(app: FastifyInstance) {
  const authService = new AuthService();

  // POST /api/auth/register
  app.post('/register', async (request, reply) => {
    try {
      const data = registerSchema.parse(request.body);
      const result = await authService.register(data);

      return reply.code(201).send(result);
    } catch (error: any) {
      if (error.message === 'Email already registered') {
        return reply.code(409).send({ error: error.message });
      }
      throw error;
    }
  });

  // POST /api/auth/login
  app.post('/login', async (request, reply) => {
    try {
      const data = loginSchema.parse(request.body);
      const result = await authService.login(data);

      return reply.send(result);
    } catch (error: any) {
      if (error.message === 'Invalid credentials') {
        return reply.code(401).send({ error: error.message });
      }
      throw error;
    }
  });

  // GET /api/auth/me (protegida)
  app.get('/me', {
    onRequest: [app.authenticate],
  }, async (request: FastifyRequest, reply) => {
    try {
      const userId = request.user.userId;
      const user = await authService.me(userId);

      return reply.send(user);
    } catch (error) {
      return reply.code(404).send({ error: 'User not found' });
    }
  });
}