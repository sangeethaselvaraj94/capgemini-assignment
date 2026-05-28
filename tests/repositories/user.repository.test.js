jest.mock('../../src/config/database', () => ({
  execute: jest.fn(),
}));

const pool = require('../../src/config/database');
const UserRepository = require('../../src/repositories/user.repository');

describe('UserRepository', () => {
  afterEach(() => jest.resetAllMocks());

  test('createUser should return created user id', async () => {
    pool.execute.mockResolvedValue([{ insertId: 42 }]);
    const user = await UserRepository.createUser({ username: 'u', email: 'e', password_hash: 'ph' });
    expect(user).toHaveProperty('id', 42);
  });

  test('findByEmail returns null when not found', async () => {
    pool.execute.mockResolvedValue([[]]);
    const res = await UserRepository.findByEmail('a');
    expect(res).toBeNull();
  });
});
