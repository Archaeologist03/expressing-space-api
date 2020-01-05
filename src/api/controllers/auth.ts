import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.log('Signin up, from controller');

  const data: { msg: string } = { msg: 'hey there, youre signing up' };

  res.json(data);
};
