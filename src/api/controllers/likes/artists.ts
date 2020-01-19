import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';

import Artist from '../../../models/likes/artist';
import { I_ErrorObject } from '../../../interfaces/IErrors';

// -------------------------------------------------------
// @GET /likes/artists/
// Protected
// GET ARTISTS FROM CURRENT USER
export const getArtists = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const currentPage = req.query.page || 1;
  const perPage = 2;

  try {
    // @ts-ignore
    const userId = req.userId;
    const totalItems = await Artist.find({
      users: { _id: userId },
    }).countDocuments();

    // Find only ones that has current user id
    const artists = await Artist.find({
      users: { _id: userId },
    })
      .skip((currentPage - 1) * perPage)
      .limit(perPage)
      .select('-users');

    res.status(200).json({
      message: 'Fetched current user Artists.',
      userId,
      artists,
      totalItems,
    });
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
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

// -------------------------------------------------------
// @PUT /likes/artists/
// Protected
// ADD NEW ARTIST OR UPDATE USERS FIELD IN EXISTING ARTIST
export const addArtist = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error: I_ErrorObject = new Error('Validation failed.');
    error.statusCode = 422;
    error.data = errors.array()[0];
    return next(error);
  }

  // @ts-ignore
  const { userId } = req;
  const { name } = req.body;

  // ==== If artist exist in db ====
  const findArtistInDb = await Artist.findOne({ name });
  if (findArtistInDb) {
    const usersList = await findArtistInDb.get('users');
    const doesUserExist = usersList.includes(userId.toString());

    //  If userId exists in users array
    if (doesUserExist) {
      const error: I_ErrorObject = new Error(
        'This user ID already exists in this artist users.',
      );
      error.statusCode = 409;
      return next(error);
    }
    // Artist exists but current user ID is not there - user didnt added this artist yet
    else {
      const x = await Artist.updateOne(
        { name },
        { $push: { users: { _id: userId } } },
      );
    }
  }

  const artist = new Artist({
    name,
    users: [userId],
  });

  try {
    const addedArtist = await (await artist.save()).toObject();
    res.status(201).json({
      message: 'Artist added successfully.',
      artist: { name: addedArtist.name, _id: addedArtist._id },
    });
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};

// Edit/update/rename a Artist instance
// ####Might not need - it might be better if user could just delete misstyped like and add new
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
