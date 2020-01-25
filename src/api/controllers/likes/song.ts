import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';

import Song from '../../../models/likes/song';
import { I_ErrorObject } from '../../../interfaces/IErrors';

// -------------------------------------------------------
// @GET /likes/songs/
// Protected
// GET SONGS FROM CURRENT USER
export const getSongs = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const currentPage = req.query.page || 1;
  const perPage = 2;

  try {
    // @ts-ignore
    const userId = req.userId;
    const totalItems = await Song.find({
      users: { _id: userId },
    }).countDocuments();

    // Find only ones that has current user id
    const songs = await Song.find({
      users: { _id: userId },
    })
      .skip((currentPage - 1) * perPage)
      .limit(perPage)
      .select('-users');

    return res.status(200).json({
      message: 'Fetched current user Songs.',
      userId,
      songs,
      totalItems,
    });
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    return next(err);
  }
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

// -------------------------------------------------------
// @PUT /likes/songs/
// Protected
// ADD NEW SONG OR UPDATE USERS FIELD IN EXISTING SONG
export const addSong = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error: I_ErrorObject = new Error('Validation failed.');
    error.statusCode = 422;
    error.data = errors.array()[0];
    return next(error);
  }

  // @ts-ignore
  const { userId } = req;
  const { title, artist } = req.body;

  const findSongInDb = await Song.findOne({ title, artist });

  // ==== If song exist in db ====
  if (findSongInDb) {
    const usersList = await findSongInDb.get('users');
    const doesUserExist = usersList.includes(userId.toString());

    //  If userId exists in users array
    if (doesUserExist) {
      const error: I_ErrorObject = new Error('You already added this song.');
      error.statusCode = 409;
      return next(error);
    }
    // Song exists but current user ID is not there - user didnt added this song yet
    else {
      const addedSong = await Song.findOneAndUpdate(
        { title, artist },
        { $push: { users: { _id: userId } } },
        { new: true },
      );

      return res.status(201).json({
        message: 'Song added successfully.',
        song: {
          title: addedSong.title,
          // @ts-ignore
          author: addSong.artist,
          _id: addedSong._id,
        },
      });
    }
  }

  const newSong = new Song({
    title,
    artist,
    users: [userId],
  });

  // ==== Song doesn't exist in db ====
  try {
    const addedSong = await (await newSong.save()).toObject();
    return res.status(201).json({
      message: 'Song added successfully.',
      song: {
        title: addedSong.title,
        artist: addedSong.artist,
        _id: addedSong._id,
      },
    });
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    return next(err);
  }
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

// -------------------------------------------------------
// @DELETE /likes/songs/:songId
// Protected
// DELETE CURRENT USER ID FROM SELECTED SONG - IF USERS ARRAY EMPTY = DELETE WHOLE SONG FROM DB
export const deleteSong = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // @ts-ignore
  const { userId } = req;
  const songId = req.params.songId;

  try {
    const findSongInDb = await Song.findById(songId);

    // ==== If song exist in db ====
    if (findSongInDb) {
      const usersList = await findSongInDb.get('users');
      const doesUserExist = usersList.includes(userId.toString());

      //  If userId doesn't exist in song
      if (!doesUserExist) {
        const error: I_ErrorObject = new Error(
          "This user ID doesn't exist on this song. ",
        );
        error.statusCode = 404;
        return next(error);
      } else {
        // Deleting userId from song
        const songAfterDeletion = await Song.findByIdAndUpdate(
          songId,
          { $pull: { users: userId } },
          { new: true },
        );

        // If users array is empty - delete song from db
        if (!songAfterDeletion.users[0]) {
          await Song.findByIdAndDelete(songId);
        }

        return res.status(202).json({
          message: 'Song deleted successfuly.',
          songId,
        });
      }
      // Song doesn't exist in db
    } else {
      const error: I_ErrorObject = new Error("This song doesn't exist.");
      error.statusCode = 404;
      return next(error);
    }
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    return next(err);
  }
};
