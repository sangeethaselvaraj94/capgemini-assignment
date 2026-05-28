const ProjectRepository = require('../repositories/project.repository');
const UserRepository = require('../repositories/user.repository');

const createProject = async ({ user_id, name, description }) => {
  const user = await UserRepository.findById(user_id);
  if (!user) {
    const error = new Error('User not found');
    error.status = 404;
    throw error;
  }

  return ProjectRepository.createProject({ user_id, name, description });
};

const listProjects = async ({ page = 1, limit = 10 }) => {
  const safePage = Number(page) > 0 ? Number(page) : 1;
  const safeLimit = Number(limit) > 0 ? Number(limit) : 10;
  const offset = (safePage - 1) * safeLimit;
  const [projects, total] = await Promise.all([
    ProjectRepository.getProjects({ limit: safeLimit, offset }),
    ProjectRepository.countProjects(),
  ]);

  return {
    data: projects,
    meta: {
      page: safePage,
      limit: safeLimit,
      total,
      pages: Math.ceil(total / safeLimit),
    },
  };
};

const getProjectById = async (id) => {
  const project = await ProjectRepository.getProjectById(id);
  if (!project) {
    const error = new Error('Project not found');
    error.status = 404;
    throw error;
  }
  return project;
};

const updateProject = async (id, { name, description }) => {
  const project = await ProjectRepository.getProjectById(id);
  if (!project) {
    const error = new Error('Project not found');
    error.status = 404;
    throw error;
  }

  const updated = await ProjectRepository.updateProject(id, { name, description });
  if (!updated) {
    const error = new Error('Unable to update project');
    error.status = 500;
    throw error;
  }

  return ProjectRepository.getProjectById(id);
};

const deleteProject = async (id) => {
  const project = await ProjectRepository.getProjectById(id);
  if (!project) {
    const error = new Error('Project not found');
    error.status = 404;
    throw error;
  }

  const deleted = await ProjectRepository.deleteProject(id);
  if (!deleted) {
    const error = new Error('Unable to delete project');
    error.status = 500;
    throw error;
  }

  return { deleted: true };
};

module.exports = {
  createProject,
  listProjects,
  getProjectById,
  updateProject,
  deleteProject,
};
