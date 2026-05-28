const { body, param, query } = require('express-validator');

const paginationRules = [
  query('page')
    .optional()
    .toInt()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .toInt()
    .isInt({ min: 1 })
    .withMessage('Limit must be a positive integer'),
  query('projectId')
    .optional()
    .toInt()
    .isInt({ min: 1 })
    .withMessage('projectId must be a positive integer'),
  query('userId')
    .optional()
    .toInt()
    .isInt({ min: 1 })
    .withMessage('userId must be a positive integer'),
  query('status')
    .optional()
    .isString()
    .trim()
    .isIn(['pending', 'in_progress', 'completed'])
    .withMessage('Status must be pending, in_progress, or completed'),
];

const createTaskRules = [
  body('project_id')
    .isInt({ min: 1 })
    .withMessage('project_id is required and must be a positive integer'),
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Task title is required')
    .isLength({ max: 255 })
    .withMessage('Task title must be at most 255 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage('Description must be at most 2000 characters'),
  body('status')
    .optional()
    .isIn(['pending', 'in_progress', 'completed'])
    .withMessage('Status must be pending, in_progress, or completed'),
];

const getTaskByIdRules = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('Task id must be a positive integer'),
];

const updateTaskRules = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('Task id must be a positive integer'),
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Task title is required')
    .isLength({ max: 255 })
    .withMessage('Task title must be at most 255 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage('Description must be at most 2000 characters'),
  body('status')
    .optional()
    .isIn(['pending', 'in_progress', 'completed'])
    .withMessage('Status must be pending, in_progress, or completed'),
];

const deleteTaskRules = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('Task id must be a positive integer'),
];

module.exports = {
  paginationRules,
  createTaskRules,
  getTaskByIdRules,
  updateTaskRules,
  deleteTaskRules,
};
