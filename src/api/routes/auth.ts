import { Router, Request, Response, NextFunction } from 'express';
import { body } from 'express-validator';

import * as authController from '../controllers/auth';
import User from '../../models/user';

const route = Router();

route.post(
  '/signup',
  [
    body('email')
      .isEmail()
      .withMessage('Please enter valid email')
      // Check if email exist in DB
      .custom(async (value, { req }) => {
        const existingUser = User.findOne({ email: value });
        return existingUser && Promise.reject('Email address already exists.');
      })
      .normalizeEmail(),
    body('username')
      .trim()
      .not()
      .isEmpty(),
    body('password')
      .trim()
      .isLength({ min: 5 }),
  ],
  authController.signup,
);

route.post('/login', [], authController.login);

export default route;
