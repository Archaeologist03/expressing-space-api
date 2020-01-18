import { Request, Response, NextFunction } from 'express';
import Artist from '../../../models/likes/artist';
import User from '../../../models/user';

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
  res.json({ msg: 'hi from getArtist', prm: req.params });
};

// Add a Artist to a collection
export const addArtist = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // @ts-ignore
  const { userId } = req;
  const { name } = req.body;

  const findArtistInDb = await Artist.findOne({ name });
  // If artist exist in db, just add current user id if it's not there
  if (findArtistInDb) {
    const user = await User.findById(userId);
    const usersList = findArtistInDb.get('users');

    console.log(usersList);
    console.log(usersList[0]);
  }

  const artist = new Artist({
    name,
    users: userId, //#TODO: add artist id who created this artist
  });

  try {
    await artist.save();

    // #TODO: After saving artist, we should add its id to user artists array

    // res.status(201).json({
    //   message: 'Artist added successfully.',
    //   artist: artist,
    // });
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

  const artistId = req.params.artistId;

  try {
    const artist = await Artist.findById(artistId);

    // #TODO: From here we need user to look into his artists
    // If in his array is artist with this Id, we delete it from there
    // For now we are going to keep artist in artist array (not users)
    // But might delete it from artist as well, need to figure logic of checking if any other user has it listed, if not - can delete.

    console.log(artist, artistId);
  } catch (err) {
    console.log(err, 'error deleting artist');
  }

  res.json({ msg: 'hi from del', parms: req.params });
};
// 5e1cb099feb25631f4d8f77d
