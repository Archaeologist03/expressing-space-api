import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';

import TvShow from '../../../models/likes/tvShow';
import { I_ErrorObject } from '../../../interfaces/IErrors';

// -------------------------------------------------------
// @GET /likes/tvShows/
// Protected
// GET TVSHOWS FROM CURRENT USER
export const getTvShows = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const currentPage = req.query.page || 1;
  const perPage = 2;

  try {
    // @ts-ignore
    const userId = req.userId;
    const totalItems = await TvShow.find({
      users: { _id: userId },
    }).countDocuments();

    // Find only ones that has current user id
    const tvShows = await TvShow.find({
      users: { _id: userId },
    })
      .skip((currentPage - 1) * perPage)
      .limit(perPage)
      .select('-users');

    return res.status(200).json({
      message: 'Fetched current user TvShows.',
      userId,
      tvShows,
      totalItems,
    });
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    return next(err);
  }
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

// -------------------------------------------------------
// @PUT /likes/tvShows/
// Protected
// ADD NEW TVSHOW OR UPDATE USERS FIELD IN EXISTING TVSHOW
export const addTvShow = async (
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
  const { title } = req.body;

  const findTvShowInDb = await TvShow.findOne({ title });

  // ==== If tvShow exist in db ====
  if (findTvShowInDb) {
    const usersList = await findTvShowInDb.get('users');
    const doesUserExist = usersList.includes(userId.toString());

    //  If userId exists in users array
    if (doesUserExist) {
      const error: I_ErrorObject = new Error('You already added this tvShow.');
      error.statusCode = 409;
      return next(error);
    }
    // TvShow exists but current user ID is not there - user didnt added this tvShow yet
    else {
      const addedTvShow = await TvShow.findOneAndUpdate(
        { title },
        { $push: { users: { _id: userId } } },
        { new: true },
      );

      return res.status(201).json({
        message: 'UserId added to TvShow successfully.',
        tvShow: { title: addedTvShow.title, _id: addedTvShow._id },
      });
    }
  }

  const newTvShow = new TvShow({
    title,
    users: [userId],
  });

  // ==== TvShow doesn't exist in db ====
  try {
    const addedTvShow = await (await newTvShow.save()).toObject();
    return res.status(201).json({
      message: 'TvShow added successfully.',
      tvShow: { title: addedTvShow.title, _id: addedTvShow._id },
    });
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    return next(err);
  }
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

// -------------------------------------------------------
// @DELETE /likes/tvShows/:tvShowId
// Protected
// DELETE CURRENT USER ID FROM SELECTED TvShow - IF USERS ARRAY EMPTY = DELETE WHOLE TvShow FROM DB
export const deleteTvShow = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // @ts-ignore
  const { userId } = req;
  const tvShowId = req.params.tvShowId;

  try {
    const findTvShowInDb = await TvShow.findById(tvShowId);

    // ==== If TvShow exist in db ====
    if (findTvShowInDb) {
      const usersList = await findTvShowInDb.get('users');
      const doesUserExist = usersList.includes(userId.toString());

      //  If userId doesn't exist in TvShow
      if (!doesUserExist) {
        const error: I_ErrorObject = new Error(
          "This user ID doesn't exist on this tvShow. ",
        );

        error.statusCode = 404;
        return next(error);
      } else {
        // Deleting userId from tvShow
        const tvShowAfterDeletion = await TvShow.findByIdAndUpdate(
          tvShowId,
          { $pull: { users: userId } },
          { new: true },
        );

        // If users array is empty - delete tvShow from db
        if (!tvShowAfterDeletion.users[0]) {
          await TvShow.findByIdAndDelete(tvShowId);
        }

        return res.status(202).json({
          message: 'UserId deleted from tvShow',
          tvShowId,
        });
      }
      // tvShow doesn't exist in db
    } else {
      const error: I_ErrorObject = new Error("This tvShow doesn't exist.");
      error.statusCode = 404;
      return next(error);
    }
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    return next(err);
  }
};
