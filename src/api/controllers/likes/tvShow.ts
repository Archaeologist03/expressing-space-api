import { Request, Response, NextFunction } from 'express';

// Get all TvShows from current user
export const getTvShows = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.log('getting getTvShows ');
  res.json({ msg: 'hi from getTvShows' });
};

// Get single TvShow  ####Might not need
export const getTvShow = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.log('getting single getTvShow ');
  res.json({ msg: 'hi from getTvShow' });
};

// Add a TvShow to a collection
export const addTvShow = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.log('add addTvShow ');
  res.json({ msg: 'hi from addTvShow ' });
};

// Edit/update/rename a TvShow instance
export const editTvShow = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.log('updating editTvShow ');
  res.json({ msg: 'hi from editTvShow' });
};

// Delete TvShow
export const deleteTvShow = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.log('deleting deleteTvShow ');
  res.json({ msg: 'hi from deleteTvShow' });
};
