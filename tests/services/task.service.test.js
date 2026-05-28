const TaskService = require('../../src/services/task.service');
const TaskRepository = require('../../src/repositories/task.repository');
const ProjectRepository = require('../../src/repositories/project.repository');
const UserRepository = require('../../src/repositories/user.repository');

jest.mock('../../src/repositories/task.repository');
jest.mock('../../src/repositories/project.repository');
jest.mock('../../src/repositories/user.repository');

describe('TaskService', () => {
  afterEach(() => jest.resetAllMocks());

  test('createTask - success', async () => {
    ProjectRepository.getProjectById.mockResolvedValue({ id: 1 });
    UserRepository.findById.mockResolvedValue({ id: 2 });
    TaskRepository.createTask.mockResolvedValue({ id: 5, title: 'T' });

    const res = await TaskService.createTask({ project_id: 1, user_id: 2, title: 'T' });
    expect(res).toHaveProperty('id', 5);
    expect(TaskRepository.createTask).toHaveBeenCalled();
  });

  test('createTask - project not found', async () => {
    ProjectRepository.getProjectById.mockResolvedValue(null);
    await expect(TaskService.createTask({ project_id: 9, user_id: 2, title: 'x' })).rejects.toHaveProperty('message', 'Project not found');
  });

  test('createTask - user not found', async () => {
    ProjectRepository.getProjectById.mockResolvedValue({ id: 1 });
    UserRepository.findById.mockResolvedValue(null);
    await expect(TaskService.createTask({ project_id: 1, user_id: 99, title: 'x' })).rejects.toHaveProperty('message', 'User not found');
  });

  test('listTasks - pagination and filters', async () => {
    TaskRepository.getTasks.mockResolvedValue([{ id: 1 }]);
    TaskRepository.countTasks.mockResolvedValue(1);
    const res = await TaskService.listTasks({ page: 1, limit: 10, projectId: 1 });
    expect(res).toHaveProperty('data');
    expect(res.meta.total).toBe(1);
  });

  test('getTaskById - not found', async () => {
    TaskRepository.getTaskById.mockResolvedValue(null);
    await expect(TaskService.getTaskById(11)).rejects.toHaveProperty('message', 'Task not found');
  });

  test('updateTask - success', async () => {
    TaskRepository.getTaskById.mockResolvedValue({ id: 7 });
    TaskRepository.updateTask.mockResolvedValue(true);
    TaskRepository.getTaskById.mockResolvedValue({ id: 7, title: 'updated' });

    const res = await TaskService.updateTask(7, { title: 'updated' });
    expect(res).toHaveProperty('id', 7);
  });

  test('deleteTask - not found', async () => {
    TaskRepository.getTaskById.mockResolvedValue(null);
    await expect(TaskService.deleteTask(99)).rejects.toHaveProperty('message', 'Task not found');
  });
});
