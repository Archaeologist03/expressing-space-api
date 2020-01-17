import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { validationResult } from 'express-validator';

import { I_ErrorObject } from '../../interfaces/IErrors';
import { JWT_SECRET } from '../../utils/secrets';
import User from '../../models/user';

// Singup User
// Create new user account
export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error: I_ErrorObject = new Error('Validation failed.');
    error.statusCode = 422;
    error.data = errors.array();
    return next(error);
  }

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

    const addedUser = await user.save();

    const token = jwt.sign({ id: addedUser.id }, JWT_SECRET, {
      expiresIn: '1h',
    });

    res
      .status(201)
      .json({ token, message: 'User created!', userId: addedUser._id });
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
