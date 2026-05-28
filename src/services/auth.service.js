const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UserRepository = require('../repositories/user.repository');
require('dotenv').config({ silent: true });

const SALT_ROUNDS = 10;

const generateToken = (user) => {
  const payload = {
    id: user.id,
    username: user.username,
    email: user.email,
  };

  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '24h',
  });
};

const register = async ({ username, email, password }) => {
  const existingByEmail = await UserRepository.findByEmail(email);
  if (existingByEmail) {
    const error = new Error('Email already registered');
    error.status = 409;
    throw error;
  }

  const existingByUsername = await UserRepository.findByUsername(username);
  if (existingByUsername) {
    const error = new Error('Username already registered');
    error.status = 409;
    throw error;
  }

  const password_hash = await bcrypt.hash(password, SALT_ROUNDS);
  const user = await UserRepository.createUser({ username, email, password_hash });
  return user;
};

const login = async ({ email, password }) => {
  const user = await UserRepository.findByEmail(email);
  if (!user) {
    const error = new Error('Invalid credentials');
    error.status = 401;
    throw error;
  }

  const isMatch = await bcrypt.compare(password, user.password_hash);
  if (!isMatch) {
    const error = new Error('Invalid credentials');
    error.status = 401;
    throw error;
  }

  const token = generateToken(user);
  return { token, user: { id: user.id, username: user.username, email: user.email } };
};

const getProfile = async (userId) => {
  const user = await UserRepository.findById(userId);
  if (!user) {
    const error = new Error('User not found');
    error.status = 404;
    throw error;
  }
  return user;
};

module.exports = {
  register,
  login,
  getProfile,
};
