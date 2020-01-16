import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt, { hash } from 'bcryptjs';
import { validationResult } from 'express-validator';

import { I_ErrorObject } from '../../interfaces/IErrors';
import User from '../../models/user';

// Singup User
// Create new user account
export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.log('Signin up, from controller');

  // const errors = validationResult(req);
  // if (!errors.isEmpty()) {
  //   const error: I_ErrorObject = new Error('Validation failed.');
  //   error.statusCode = 422;
  //   error.data = errors.array();
  //   throw error;
  // }

  const email = req.body.email;
  const username = req.body.username;
  const password = req.body.password;
  try {
    const hashedPw = await bcrypt.hash(password, 12);

    const user = new User({
      email,
      username,
      password: hashedPw,
    });

    const result = await user.save();
    console.log(result);
    res.status(201).json({ message: 'User created!', userId: result._id });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
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
