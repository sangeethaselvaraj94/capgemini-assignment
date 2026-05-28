const pool = require('../config/database');

const createUser = async ({ username, email, password_hash }) => {
  const query = `INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)`;
  const [result] = await pool.execute(query, [username, email, password_hash]);
  return { id: result.insertId, username, email };
};

const findByEmail = async (email) => {
  const query = `SELECT id, username, email, password_hash, created_at, updated_at FROM users WHERE email = ? LIMIT 1`;
  const [rows] = await pool.execute(query, [email]);
  return rows[0] || null;
};

const findByUsername = async (username) => {
  const query = `SELECT id, username, email, password_hash, created_at, updated_at FROM users WHERE username = ? LIMIT 1`;
  const [rows] = await pool.execute(query, [username]);
  return rows[0] || null;
};

const findById = async (id) => {
  const query = `SELECT id, username, email, created_at, updated_at FROM users WHERE id = ? LIMIT 1`;
  const [rows] = await pool.execute(query, [id]);
  return rows[0] || null;
};

module.exports = {
  createUser,
  findByEmail,
  findByUsername,
  findById,
};
