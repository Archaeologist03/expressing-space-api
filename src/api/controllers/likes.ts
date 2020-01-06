import { Request, Response, NextFunction } from 'express';

// Get all likes from current user
export const getLikes = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.log('getting likes ');
  res.json({ msg: 'hi from getLikes' });
};

// Get single like  ####Might not need
export const getLike = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.log('getting single like ');
  res.json({ msg: 'hi from getLike' });
};

// Add a like to a current user likes
export const addLike = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.log('add likes ');
  res.json({ msg: 'hi from addLike ' });
};

// Update/edit single like
export const updateLike = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.log('updating likes ');
  res.json({ msg: 'hi from updateLike' });
};

// Delete like
export const deleteLike = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.log('deleting likes ');
  res.json({ msg: 'hi from deleteLike' });
};
