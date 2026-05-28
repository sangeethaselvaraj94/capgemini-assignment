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
];

const createProjectRules = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Project name is required')
    .isLength({ max: 255 })
    .withMessage('Project name must be at most 255 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage('Description must be at most 2000 characters'),
];

const getProjectByIdRules = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('Project id must be a positive integer'),
];

const updateProjectRules = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('Project id must be a positive integer'),
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Project name is required')
    .isLength({ max: 255 })
    .withMessage('Project name must be at most 255 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage('Description must be at most 2000 characters'),
];

const deleteProjectRules = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('Project id must be a positive integer'),
];

module.exports = {
  paginationRules,
  createProjectRules,
  getProjectByIdRules,
  updateProjectRules,
  deleteProjectRules,
};
