const AuthService = require('../../src/services/auth.service');
const UserRepository = require('../../src/repositories/user.repository');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

jest.mock('../../src/repositories/user.repository');
jest.mock('bcrypt');
jest.mock('jsonwebtoken');

describe('AuthService', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  test('register - success', async () => {
    UserRepository.findByEmail.mockResolvedValue(null);
    UserRepository.findByUsername.mockResolvedValue(null);
    bcrypt.hash.mockResolvedValue('hashedpw');
    UserRepository.createUser.mockResolvedValue({ id: 1, username: 'test', email: 'test@example.com' });

    const user = await AuthService.register({ username: 'test', email: 'test@example.com', password: 'password' });
    expect(user).toHaveProperty('id', 1);
    expect(UserRepository.createUser).toHaveBeenCalled();
  });

  test('register - duplicate email', async () => {
    UserRepository.findByEmail.mockResolvedValue({ id: 1 });
    await expect(AuthService.register({ username: 'u', email: 'e', password: 'p' })).rejects.toHaveProperty('message', 'Email already registered');
  });

  test('login - success', async () => {
    const mockUser = { id: 1, username: 'u', email: 'e', password_hash: 'hashed' };
    UserRepository.findByEmail.mockResolvedValue(mockUser);
    bcrypt.compare.mockResolvedValue(true);
    jwt.sign.mockReturnValue('token');

    const res = await AuthService.login({ email: 'e', password: 'p' });
    expect(res).toHaveProperty('token', 'token');
    expect(res.user).toHaveProperty('id', 1);
  });

  test('login - invalid credentials', async () => {
    UserRepository.findByEmail.mockResolvedValue(null);
    await expect(AuthService.login({ email: 'e', password: 'p' })).rejects.toHaveProperty('message', 'Invalid credentials');
  });
});
