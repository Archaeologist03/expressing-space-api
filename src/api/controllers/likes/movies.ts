import { Request, Response, NextFunction } from 'express';

// Get all Movies from current user
export const getMovies = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.log('getting getMovies ');
  res.json({ msg: 'hi from getMovies' });
};

// Get single Movie  ####Might not need
export const getMovie = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.log('getting single getMovie ');
  res.json({ msg: 'hi from getMovie' });
};

// Add a Movie to a collection
export const addMovie = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.log('add addMovie ');
  res.json({ msg: 'hi from addMovie ' });
};

// Edit/update/rename a Movie instance
export const editMovie = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.log('updating editMovie ');
  res.json({ msg: 'hi from editMovie' });
};

// Delete Movie
export const deleteMovie = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.log('deleting deleteMovie ');
  res.json({ msg: 'hi from deleteMovie' });
};
