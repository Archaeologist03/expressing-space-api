import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

import { I_ErrorObject } from '../../interfaces/IErrors';
import { JWT_SECRET } from '../../utils/secrets';

export default (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.get('Authorization');
  if (!authHeader) {
    const error: I_ErrorObject = new Error('Not authenticated');
    error.statusCode = 401;
    throw error;
  }
  // ('Bearer <token>')
  const token = authHeader.split(' ')[1];
  let decodedToken;

  try {
    decodedToken = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    err.statusCode = 500;
    throw err;
  }
  // if didnt failed but wasnt able to verify token.
  if (!decodedToken) {
    const error: I_ErrorObject = new Error('Not authenticated.');

    error.statusCode = 401;
    throw error;
  }

  // add user to payload to every request/route that uses this middleware
  // @ts-ignore
  req.userId = decodedToken.userId;

  next();
};
