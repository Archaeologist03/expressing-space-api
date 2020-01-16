import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { validationResult } from 'express-validator';

import User from '../../models/user';

// Singup User
// Create new user account
export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.log('Signin up, from controller');

  res.json({ msg: 'hey there, youre signing up' });
};

// Login User
// Sign in with email and password
export const login = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.log('Login up, from controller');
  console.log(req.body.data);

  const reqData = req.body.data;

  const data: { msg: string; name: string } = {
    msg: 'hey there, youre logging in',
    name: reqData.name,
  };

  res.json(data);
};
