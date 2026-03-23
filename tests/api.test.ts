import { vi, describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';

// 1. Mock Bcrypt and JWT
vi.mock('bcryptjs', () => ({
  default: {
    hash: vi.fn().mockResolvedValue('hashed_password'),
    compare: vi.fn().mockResolvedValue(true),
  }
}));

vi.mock('jsonwebtoken', () => ({
  default: {
    sign: vi.fn().mockReturnValue('mocked_token'),
    verify: vi.fn((token, secret, cb) => cb(null, { id: '1', username: 'testuser' })),
  }
}));

// 2. Mock Prisma
vi.mock('@prisma/client', () => {
    const mockProduct = {
      findMany: vi.fn(),
      upsert: vi.fn(),
      delete: vi.fn(),
    };
    const mockCustomer = {
      findMany: vi.fn(),
    };
    const mockUser = {
        findUnique: vi.fn(),
        update: vi.fn(),
        upsert: vi.fn(),
        findMany: vi.fn(),
    };
    const m = {
      product: mockProduct,
      customer: mockCustomer,
      user: mockUser,
      $transaction: vi.fn(async (cb) => cb(m)),
    };
    return {
      PrismaClient: vi.fn(function() { return m; }),
    };
});

// 3. Import app after mocks
import { app, prisma } from '../server';

describe('API Endpoints', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET /api/health', () => {
    it('should return 200 and status ok', async () => {
      const res = await request(app).get('/api/health');
      expect(res.status).toBe(200);
      expect(res.body).toEqual({ status: 'ok' });
    });
  });

  describe('GET /api/products (Protected)', () => {
    it('should return 401 if no token provided', async () => {
        const res = await request(app).get('/api/products');
        expect(res.status).toBe(401);
    });

    it('should return 200 if valid token provided', async () => {
      const mockProducts = [{ id: '1', name: 'Product 1' }];
      (prisma.product.findMany as any).mockResolvedValue(mockProducts);

      const res = await request(app)
        .get('/api/products')
        .set('Authorization', 'Bearer valid_token');
        
      expect(res.status).toBe(200);
      expect(res.body).toEqual(mockProducts);
    });
  });

  describe('POST /api/auth/login', () => {
    it('should return token on valid login', async () => {
        const mockUser = { id: '1', username: 'test', password: '$2a$mocked_hash', role: 'admin' };
        (prisma.user.findUnique as any).mockResolvedValue(mockUser);

        const res = await request(app)
            .post('/api/auth/login')
            .send({ username: 'test', password: 'password' });

        expect(res.status).toBe(200);
        expect(res.body.token).toBe('mocked_token');
    });
  });
});
