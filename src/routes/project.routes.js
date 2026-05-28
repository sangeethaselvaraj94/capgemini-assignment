const express = require('express');
const ProjectService = require('../services/project.service');
const validateRequest = require('../middleware/validation.middleware');
const authenticate = require('../middleware/auth.middleware');
const catchAsync = require('../middleware/catchAsync');
const {
  paginationRules,
  createProjectRules,
  getProjectByIdRules,
  updateProjectRules,
  deleteProjectRules,
} = require('../validators/project.validator');

const router = express.Router();

router.use(authenticate);

router.get(
  '/',
  paginationRules,
  validateRequest,
  catchAsync(async (req, res) => {
    const result = await ProjectService.listProjects({
      page: Number(req.query.page) || 1,
      limit: Number(req.query.limit) || 10,
    });
    res.json({ status: 'success', data: result });
  })
);

router.post(
  '/',
  createProjectRules,
  validateRequest,
  catchAsync(async (req, res) => {
    const project = await ProjectService.createProject({
      user_id: req.user.id,
      name: req.body.name,
      description: req.body.description,
    });
    res.status(201).json({ status: 'success', data: project });
  })
);

router.get(
  '/:id',
  getProjectByIdRules,
  validateRequest,
  catchAsync(async (req, res) => {
    const project = await ProjectService.getProjectById(Number(req.params.id));
    res.json({ status: 'success', data: project });
  })
);

router.put(
  '/:id',
  updateProjectRules,
  validateRequest,
  catchAsync(async (req, res) => {
    const project = await ProjectService.updateProject(Number(req.params.id), {
      name: req.body.name,
      description: req.body.description,
    });
    res.json({ status: 'success', data: project });
  })
);

router.delete(
  '/:id',
  deleteProjectRules,
  validateRequest,
  catchAsync(async (req, res) => {
    const result = await ProjectService.deleteProject(Number(req.params.id));
    res.json({ status: 'success', data: result });
  })
);

module.exports = router;
