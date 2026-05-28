const request = require('supertest');
const app = require('../../src/index');

jest.mock('../../src/services/auth.service');
const AuthService = require('../../src/services/auth.service');

describe('Auth Routes', () => {
  afterEach(() => jest.resetAllMocks());

  test('POST /api/auth/register returns 201', async () => {
    AuthService.register.mockResolvedValue({ id: 1, username: 't', email: 't@e.com' });
    const res = await request(app).post('/api/auth/register').send({ username: 't', email: 't@e.com', password: 'password' });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('data');
  });

  test('POST /api/auth/login returns 200', async () => {
    AuthService.login.mockResolvedValue({ token: 'tok', user: { id: 1, username: 't' } });
    const res = await request(app).post('/api/auth/login').send({ email: 't@e.com', password: 'password' });
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveProperty('token', 'tok');
  });
});
