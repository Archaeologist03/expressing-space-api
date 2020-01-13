import { Request, Response, NextFunction } from 'express';
import Artist from '../../../models/likes/artist';

// Get all Artists from current user
export const getArtists = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const currentPage = req.query.page || 1;
  const perPage = 2;

  try {
    const userId = '5e14d89b1c9d440000c6fbb3'; //# it should come from user model (when setup auth middleware) - to find artist that this specific user added
    const totalItems = await Artist.find({
      users: { $elemMatch: { _id: userId } },
    }).countDocuments();

    // Grab artists from specified(current) user, excluding users(who also added it) array
    const artists = await Artist.find({
      users: { $elemMatch: { _id: userId } },
    })
      .populate('user')
      .skip((currentPage - 1) * perPage)
      .limit(perPage)
      .select('-users');

    res.status(200).json({
      message: 'Fetched current user Arrists.',
      artists,
      totalItems,
    });
  } catch (err) {
    console.log(err, '500 from get artists');
  }
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
  const { name, art, note } = req.body;

  const artist = new Artist({
    name,
    art,
    note,
    // user: req.userId,  #TODO: add artist id who created this artist
  });

  try {
    await artist.save();

    res.status(201).json({
      message: 'Artist added successfully.',
      artist: artist,
    });
  } catch (err) {
    console.log(err, 'err adding artist');
  }
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
