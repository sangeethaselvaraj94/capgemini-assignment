const pool = require('../config/database');

const createTask = async ({ project_id, user_id, title, description, status }) => {
  const query = `INSERT INTO tasks (project_id, user_id, title, description, status) VALUES (?, ?, ?, ?, ?)`;
  const [result] = await pool.execute(query, [project_id, user_id, title, description, status || 'pending']);
  return { id: result.insertId, project_id, user_id, title, description, status: status || 'pending' };
};

const getTaskById = async (id) => {
  const query = `SELECT id, project_id, user_id, title, description, status, created_at, updated_at FROM tasks WHERE id = ? LIMIT 1`;
  const [rows] = await pool.execute(query, [id]);
  return rows[0] || null;
};

const getTasks = async ({ limit = 10, offset = 0, projectId, userId, status }) => {
  const conditions = [];
  const params = [];

  if (projectId) {
    conditions.push('project_id = ?');
    params.push(projectId);
  }

  if (userId) {
    conditions.push('user_id = ?');
    params.push(userId);
  }

  if (status) {
    conditions.push('status = ?');
    params.push(status);
  }

  const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
  const query = `SELECT id, project_id, user_id, title, description, status, created_at, updated_at FROM tasks ${whereClause} ORDER BY created_at DESC LIMIT ${parseInt(limit)} OFFSET ${parseInt(offset)}`;

  const [rows] = await pool.execute(query, params);
  return rows;
};

const countTasks = async ({ projectId, userId, status }) => {
  const conditions = [];
  const params = [];

  if (projectId) {
    conditions.push('project_id = ?');
    params.push(projectId);
  }

  if (userId) {
    conditions.push('user_id = ?');
    params.push(userId);
  }

  if (status) {
    conditions.push('status = ?');
    params.push(status);
  }

  const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
  const query = `SELECT COUNT(*) as total FROM tasks ${whereClause}`;
  const [rows] = await pool.execute(query, params);
  return rows[0].total || 0;
};

const updateTask = async (id, { title, description, status }) => {
  const query = `UPDATE tasks SET title = ?, description = ?, status = ? WHERE id = ?`;
  const [result] = await pool.execute(query, [title, description, status, id]);
  return result.affectedRows > 0;
};

const deleteTask = async (id) => {
  const query = `DELETE FROM tasks WHERE id = ?`;
  const [result] = await pool.execute(query, [id]);
  return result.affectedRows > 0;
};

module.exports = {
  createTask,
  getTaskById,
  getTasks,
  countTasks,
  updateTask,
  deleteTask,
};
