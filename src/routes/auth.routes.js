const express = require('express');
const AuthService = require('../services/auth.service');
const validateRequest = require('../middleware/validation.middleware');
const authenticate = require('../middleware/auth.middleware');
const catchAsync = require('../middleware/catchAsync');
const { registerRules, loginRules } = require('../validators/auth.validator');

const router = express.Router();

router.post(
  '/register',
  registerRules,
  validateRequest,
  catchAsync(async (req, res) => {
    const user = await AuthService.register(req.body);
    res.status(201).json({ status: 'success', data: user });
  })
);

router.post(
  '/login',
  loginRules,
  validateRequest,
  catchAsync(async (req, res) => {
    const result = await AuthService.login(req.body);
    res.json({ status: 'success', data: result });
  })
);

router.get('/profile', authenticate, catchAsync(async (req, res) => {
  const profile = await AuthService.getProfile(req.user.id);
  res.json({ status: 'success', data: profile });
}));

module.exports = router;
