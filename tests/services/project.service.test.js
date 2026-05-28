const ProjectService = require('../../src/services/project.service');
const ProjectRepository = require('../../src/repositories/project.repository');
const UserRepository = require('../../src/repositories/user.repository');

jest.mock('../../src/repositories/project.repository');
jest.mock('../../src/repositories/user.repository');

describe('ProjectService', () => {
  afterEach(() => jest.resetAllMocks());

  test('createProject - success', async () => {
    UserRepository.findById.mockResolvedValue({ id: 1, username: 'u' });
    ProjectRepository.createProject.mockResolvedValue({ id: 10, user_id: 1, name: 'P' });

    const res = await ProjectService.createProject({ user_id: 1, name: 'P', description: 'd' });
    expect(res).toHaveProperty('id', 10);
    expect(ProjectRepository.createProject).toHaveBeenCalledWith({ user_id: 1, name: 'P', description: 'd' });
  });

  test('createProject - user not found', async () => {
    UserRepository.findById.mockResolvedValue(null);
    await expect(ProjectService.createProject({ user_id: 99, name: 'X' })).rejects.toHaveProperty('message', 'User not found');
  });

  test('listProjects - pagination', async () => {
    ProjectRepository.getProjects.mockResolvedValue([{ id: 1 }]);
    ProjectRepository.countProjects.mockResolvedValue(1);

    const res = await ProjectService.listProjects({ page: 1, limit: 10 });
    expect(res).toHaveProperty('data');
    expect(res.meta).toMatchObject({ page: 1, limit: 10, total: 1 });
  });

  test('getProjectById - not found', async () => {
    ProjectRepository.getProjectById.mockResolvedValue(null);
    await expect(ProjectService.getProjectById(5)).rejects.toHaveProperty('message', 'Project not found');
  });

  test('updateProject - success', async () => {
    ProjectRepository.getProjectById.mockResolvedValue({ id: 2 });
    ProjectRepository.updateProject.mockResolvedValue(true);
    ProjectRepository.getProjectById.mockResolvedValueOnce({ id: 2 }).mockResolvedValueOnce({ id: 2, name: 'updated' });

    ProjectRepository.getProjectById.mockResolvedValue({ id: 2, name: 'old' });
    ProjectRepository.updateProject.mockResolvedValue(true);
    ProjectRepository.getProjectById.mockResolvedValue({ id: 2, name: 'new' });

    const res = await ProjectService.updateProject(2, { name: 'new', description: 'd' });
    expect(res).toHaveProperty('id', 2);
  });

  test('deleteProject - not found', async () => {
    ProjectRepository.getProjectById.mockResolvedValue(null);
    await expect(ProjectService.deleteProject(9)).rejects.toHaveProperty('message', 'Project not found');
  });
});
