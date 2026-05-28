const express = require('express');
const TaskService = require('../services/task.service');
const validateRequest = require('../middleware/validation.middleware');
const authenticate = require('../middleware/auth.middleware');
const catchAsync = require('../middleware/catchAsync');
const {
  paginationRules,
  createTaskRules,
  getTaskByIdRules,
  updateTaskRules,
  deleteTaskRules,
} = require('../validators/task.validator');

const router = express.Router();
router.use(authenticate);

router.get(
  '/',
  paginationRules,
  validateRequest,
  catchAsync(async (req, res) => {
    const result = await TaskService.listTasks({
      page: Number(req.query.page) || 1,
      limit: Number(req.query.limit) || 10,
      projectId: req.query.projectId ? Number(req.query.projectId) : undefined,
      userId: req.query.userId ? Number(req.query.userId) : undefined,
      status: req.query.status,
    });
    res.json({ status: 'success', data: result });
  })
);

router.post(
  '/',
  createTaskRules,
  validateRequest,
  catchAsync(async (req, res) => {
    const task = await TaskService.createTask({
      project_id: Number(req.body.project_id),
      user_id: req.user.id,
      title: req.body.title,
      description: req.body.description,
      status: req.body.status,
    });
    res.status(201).json({ status: 'success', data: task });
  })
);

router.get(
  '/:id',
  getTaskByIdRules,
  validateRequest,
  catchAsync(async (req, res) => {
    const task = await TaskService.getTaskById(Number(req.params.id));
    res.json({ status: 'success', data: task });
  })
);

router.put(
  '/:id',
  updateTaskRules,
  validateRequest,
  catchAsync(async (req, res) => {
    const task = await TaskService.updateTask(Number(req.params.id), {
      title: req.body.title,
      description: req.body.description,
      status: req.body.status,
    });
    res.json({ status: 'success', data: task });
  })
);

router.delete(
  '/:id',
  deleteTaskRules,
  validateRequest,
  catchAsync(async (req, res) => {
    const result = await TaskService.deleteTask(Number(req.params.id));
    res.json({ status: 'success', data: result });
  })
);

module.exports = router;
