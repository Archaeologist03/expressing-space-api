import { Request, Response, NextFunction } from 'express';

// Get all Artists from current user
export const getArtists = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.log('getting getArtists ');
  res.json({ msg: 'hi from getArtists' });
};

// Get single Artist  ####Might not need
export const getArtist = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.log('getting single getArtist ');
  res.json({ msg: 'hi from getArtist' });
};

// Add a Artist to a collection
export const addArtist = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.log('add addArtist ');
  res.json({ msg: 'hi from addArtist ' });
};

// Edit/update/rename a Artist instance
export const editArtist = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.log('updating editArtist ');
  res.json({ msg: 'hi from editArtist' });
};

// Delete Artist
export const deleteArtist = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.log('deleting deleteArtist ');
  res.json({ msg: 'hi from deleteArtist' });
};
