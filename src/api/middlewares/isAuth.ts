import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

import { I_ErrorObject } from '../../interfaces/IErrors';
import { JWT_SECRET } from '../../utils/secrets';

export default (req: Request, res: Response, next: NextFunction) => {
  // Get Authorization header from req
  // Check if header exists, if not throw err
  const authHeader = req.get('Authorization');
  if (!authHeader) {
    const error: I_ErrorObject = new Error('Not authenticated');
    error.statusCode = 401;
    throw error;
  }
  // If header does exist
  // split it up ('Bearer <token>') and get just token([1])
  const token = authHeader.split(' ')[1];
  let decodedToken;
  try {
    // decode and verify, validate the token.
    decodedToken = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    err.statusCode = 500;
    throw err;
  }
  // if undefined = didnt failed but wasnt able to verify token.
  if (!decodedToken) {
    const error: I_ErrorObject = new Error('Not authenticated.');
    error.statusCode = 401;
    throw error;
  }
  // We got valid token.
  // add user to payload. To every request/route that uses this middleware
  // @ts-ignore
  req.userId = decodedToken.userId;
  next();
};
