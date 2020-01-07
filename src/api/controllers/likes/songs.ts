import { Request, Response, NextFunction } from 'express';

// Get all Songs from current user
export const getSongs = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.log('getting getSongs ');
  res.json({ msg: 'hi from getSongs' });
};

// Get single Song  ####Might not need
export const getSong = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.log('getting single getSong ');
  res.json({ msg: 'hi from getSong' });
};

// Add a Song to a collection
export const addSong = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.log('add addSong ');
  res.json({ msg: 'hi from addSong ' });
};

// Edit/update/rename a Song instance
export const editSong = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.log('updating editSong ');
  res.json({ msg: 'hi from editSong' });
};

// Delete Song
export const deleteSong = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.log('deleting deleteSong ');
  res.json({ msg: 'hi from deleteSong' });
};
