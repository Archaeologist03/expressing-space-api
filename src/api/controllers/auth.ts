import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { validationResult } from 'express-validator';

import { I_ErrorObject } from '../../interfaces/IErrors';
import { I_UserObject } from '../../interfaces/IUser';
import { JWT_SECRET } from '../../utils/secrets';
import User from '../../models/user';

const JWT_EXPIRE_TIME = '72h';

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

  const { email, username, password } = req.body;

  try {
    const hashedPw = await bcrypt.hash(password, 12);

    const user = new User({
      email,
      username,
      password: hashedPw,
    });

    // #TODO: Make interface work with async
    // @ts-ignore
    const addedUser: I_UserObject = await user.save();

    const token = jwt.sign(
      {
        email: addedUser.email,
        userId: addedUser._id.toString(),
      },
      JWT_SECRET,
      {
        expiresIn: JWT_EXPIRE_TIME,
      },
    );

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
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error: I_ErrorObject = new Error('Validation failed.');
    error.statusCode = 401;
    error.data = errors.array()[0];

    return next(error);
  }

  const { email, password } = req.body;

  try {
    // #TODO: Make interface work with async
    // @ts-ignore
    const user: I_UserObject = await User.findOne({ email });

    const isEqual = await bcrypt.compare(password, user.password);

    if (!isEqual) {
      const error: I_ErrorObject = new Error('Invalid Credentials');
      error.statusCode = 401;
      return next(error);
    }

    const token = jwt.sign(
      {
        email: user.email,
        userId: user._id.toString(),
      },
      JWT_SECRET,
      {
        expiresIn: JWT_EXPIRE_TIME,
      },
    );

    res.status(200).json({ token, userId: user._id.toString() });
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};
