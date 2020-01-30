import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';

import { I_ErrorObject } from '../../interfaces/IErrors';
import { I_Profile } from '../../interfaces/I_Profile';
import Profile from '../../models/profile';

export const getProfiles = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {};

export const getProfile = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {};

export const updateProfile = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {};

export const deleteProfile = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {};
