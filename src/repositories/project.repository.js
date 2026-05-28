const pool = require('../config/database');

const createProject = async ({ user_id, name, description }) => {
  const query = `INSERT INTO projects (user_id, name, description) VALUES (?, ?, ?)`;
  const [result] = await pool.execute(query, [user_id, name, description]);
  return { id: result.insertId, user_id, name, description };
};

const getProjectById = async (id) => {
  const query = `SELECT id, user_id, name, description, created_at, updated_at FROM projects WHERE id = ? LIMIT 1`;
  const [rows] = await pool.execute(query, [id]);
  return rows[0] || null;
};

const getProjects = async ({ limit = 10, offset = 0 }) => {
  const safeLimit = Number(limit) || 10;
  const safeOffset = Number(offset) || 0;
  const query = `SELECT id, user_id, name, description, created_at, updated_at FROM projects ORDER BY created_at DESC LIMIT ${safeLimit} OFFSET ${safeOffset}`;
  const [rows] = await pool.query(query);
  return rows;
};

const countProjects = async () => {
  const query = `SELECT COUNT(*) as total FROM projects`;
  const [rows] = await pool.execute(query);
  return rows[0].total || 0;
};

const updateProject = async (id, { name, description }) => {
  const query = `UPDATE projects SET name = ?, description = ? WHERE id = ?`;
  const [result] = await pool.execute(query, [name, description, id]);
  return result.affectedRows > 0;
};

const deleteProject = async (id) => {
  const query = `DELETE FROM projects WHERE id = ?`;
  const [result] = await pool.execute(query, [id]);
  return result.affectedRows > 0;
};

module.exports = {
  createProject,
  getProjectById,
  getProjects,
  countProjects,
  updateProject,
  deleteProject,
};
