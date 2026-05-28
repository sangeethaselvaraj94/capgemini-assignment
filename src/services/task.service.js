const TaskRepository = require('../repositories/task.repository');
const ProjectRepository = require('../repositories/project.repository');
const UserRepository = require('../repositories/user.repository');

const createTask = async ({ project_id, user_id, title, description, status }) => {
  const project = await ProjectRepository.getProjectById(project_id);
  if (!project) {
    const error = new Error('Project not found');
    error.status = 404;
    throw error;
  }

  const user = await UserRepository.findById(user_id);
  if (!user) {
    const error = new Error('User not found');
    error.status = 404;
    throw error;
  }

  return TaskRepository.createTask({ project_id, user_id, title, description, status });
};

const listTasks = async ({ page = 1, limit = 10, projectId, userId, status }) => {
  const offset = (page - 1) * limit;
  const [tasks, total] = await Promise.all([
    TaskRepository.getTasks({ limit, offset, projectId, userId, status }),
    TaskRepository.countTasks({ projectId, userId, status }),
  ]);

  return {
    data: tasks,
    meta: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  };
};

const getTaskById = async (id) => {
  const task = await TaskRepository.getTaskById(id);
  if (!task) {
    const error = new Error('Task not found');
    error.status = 404;
    throw error;
  }
  return task;
};

const updateTask = async (id, { title, description, status }) => {
  const task = await TaskRepository.getTaskById(id);
  if (!task) {
    const error = new Error('Task not found');
    error.status = 404;
    throw error;
  }

  const updated = await TaskRepository.updateTask(id, { title, description, status });
  if (!updated) {
    const error = new Error('Unable to update task');
    error.status = 500;
    throw error;
  }

  return TaskRepository.getTaskById(id);
};

const deleteTask = async (id) => {
  const task = await TaskRepository.getTaskById(id);
  if (!task) {
    const error = new Error('Task not found');
    error.status = 404;
    throw error;
  }

  const deleted = await TaskRepository.deleteTask(id);
  if (!deleted) {
    const error = new Error('Unable to delete task');
    error.status = 500;
    throw error;
  }

  return { deleted: true };
};

module.exports = {
  createTask,
  listTasks,
  getTaskById,
  updateTask,
  deleteTask,
};
