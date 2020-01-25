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

    return res.status(200).json({
      message: 'Fetched current user Artists.',
      userId,
      artists,
      totalItems,
    });
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    return next(err);
  }
};

// Get single Artist  ####Might not need
export const getArtist = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.log('getting single getArtist ');
  res.json({ message: 'hi from getArtist', prm: req.params });
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

  const findArtistInDb = await Artist.findOne({ name });

  // ==== If artist exist in db ====
  if (findArtistInDb) {
    const usersList = await findArtistInDb.get('users');
    const doesUserExist = usersList.includes(userId.toString());

    //  If userId exists in users array
    if (doesUserExist) {
      const error: I_ErrorObject = new Error('You already added this artist.');
      error.statusCode = 409;
      return next(error);
    }
    // Artist exists but current user ID is not there - user didnt added this artist yet
    else {
      const addedArtist = await Artist.findOneAndUpdate(
        { name },
        { $push: { users: { _id: userId } } },
        { new: true },
      );

      return res.status(201).json({
        message: 'UserId added to Artist successfully.',
        artist: { name: addedArtist.name, _id: addedArtist._id },
      });
    }
  }

  const newArtist = new Artist({
    name,
    users: [userId],
  });

  // ==== artist doesn't exist in db ====
  try {
    const addedArtist = await (await newArtist.save()).toObject();
    return res.status(201).json({
      message: 'Artist added successfully.',
      artist: { name: addedArtist.name, _id: addedArtist._id },
    });
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    return next(err);
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
  res.json({ message: 'hi from editArtist' });
};

// -------------------------------------------------------
// @DELETE /likes/artists/:artistId
// Protected
// DELETE CURRENT USER ID FROM SELECTED ARTIST - IF USERS ARRAY EMPTY = DELETE WHOLE ARTIST FROM DB
export const deleteArtist = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // @ts-ignore
  const { userId } = req;
  const artistId = req.params.artistId;

  try {
    const findArtistInDb = await Artist.findById(artistId);

    // ==== If artist exist in db ====
    if (findArtistInDb) {
      const usersList = await findArtistInDb.get('users');
      const doesUserExist = usersList.includes(userId.toString());

      //  If userId doesn't exist in artist
      if (!doesUserExist) {
        const error: I_ErrorObject = new Error(
          "This user ID doesn't exist on this artist. ",
        );

        error.statusCode = 404;
        return next(error);
      } else {
        // Deleting userId from artist
        const artistAfterDeletion = await Artist.findByIdAndUpdate(
          artistId,
          { $pull: { users: userId } },
          { new: true },
        );

        // If users array is empty - delete artist from db
        if (!artistAfterDeletion.users[0]) {
          await Artist.findByIdAndDelete(artistId);
        }

        return res.status(202).json({
          message: 'UserId deleted from artist',
          artistId: artistId,
        });
      }
      // artist doesn't exist in db
    } else {
      const error: I_ErrorObject = new Error("This artist doesn't exist.");
      error.statusCode = 404;
      return next(error);
    }
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    return next(err);
  }
};
