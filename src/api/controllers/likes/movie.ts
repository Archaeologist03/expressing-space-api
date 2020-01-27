import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';

import Movie from '../../../models/likes/movie';
import { I_ErrorObject } from '../../../interfaces/IErrors';

// -------------------------------------------------------
// @GET /likes/movies/
// Protected
// GET MOVIES FROM CURRENT USER
export const getMovies = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const currentPage = req.query.page || 1;
  const perPage = 2;

  try {
    // @ts-ignore
    const userId = req.userId;
    const totalItems = await Movie.find({
      users: { _id: userId },
    }).countDocuments();

    // Find only ones that has current user id
    const movies = await Movie.find({
      users: { _id: userId },
    })
      .skip((currentPage - 1) * perPage)
      .limit(perPage)
      .select('-users');

    return res.status(200).json({
      message: 'Fetched current user Movies.',
      userId,
      movies,
      totalItems,
    });
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    return next(err);
  }
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

// -------------------------------------------------------
// @PUT /likes/movies/
// Protected
// ADD NEW MOVIE OR UPDATE USERS FIELD IN EXISTING MOVIE
export const addMovie = async (
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

  const findMovieInDb = await Movie.findOne({ title });

  // ==== If movie exist in db ====
  if (findMovieInDb) {
    const usersList = await findMovieInDb.get('users');
    const doesUserExist = usersList.includes(userId.toString());

    //  If userId exists in users array
    if (doesUserExist) {
      const error: I_ErrorObject = new Error('You already added this movie.');
      error.statusCode = 409;
      return next(error);
    }
    // Movie exists but current user ID is not there - user didnt added this movie yet
    else {
      const addedMovie = await Movie.findOneAndUpdate(
        { title },
        { $push: { users: { _id: userId } } },
        { new: true },
      );

      return res.status(201).json({
        message: 'UserId added to Movie successfully.',
        movie: { title: addedMovie.title, _id: addedMovie._id },
      });
    }
  }

  const newMovie = new Movie({
    title,
    users: [userId],
  });

  // ==== movie doesn't exist in db ====
  try {
    const addedMovie = await (await newMovie.save()).toObject();
    return res.status(201).json({
      message: 'Movie added successfully.',
      movie: { title: addedMovie.title, _id: addedMovie._id },
    });
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    return next(err);
  }
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

// -------------------------------------------------------
// @DELETE /likes/movies/:movieId
// Protected
// DELETE CURRENT USER ID FROM SELECTED MOVIE - IF USERS ARRAY EMPTY = DELETE WHOLE MOVIE FROM DB
export const deleteMovie = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // @ts-ignore
  const { userId } = req;
  const movieId = req.params.movieId;

  try {
    const findMovieInDb = await Movie.findById(movieId);

    // ==== If Movie exist in db ====
    if (findMovieInDb) {
      const usersList = await findMovieInDb.get('users');
      const doesUserExist = usersList.includes(userId.toString());

      //  If userId doesn't exist in Movie
      if (!doesUserExist) {
        const error: I_ErrorObject = new Error(
          "This user ID doesn't exist on this movie. ",
        );

        error.statusCode = 404;
        return next(error);
      } else {
        // Deleting userId from movie
        const movieAfterDeletion = await Movie.findByIdAndUpdate(
          movieId,
          { $pull: { users: userId } },
          { new: true },
        );

        // If users array is empty - delete movie from db
        if (!movieAfterDeletion.users[0]) {
          await Movie.findByIdAndDelete(movieId);
        }

        return res.status(202).json({
          message: 'UserId deleted from movie',
          movieId,
        });
      }
      // movie doesn't exist in db
    } else {
      const error: I_ErrorObject = new Error("This movie doesn't exist.");
      error.statusCode = 404;
      return next(error);
    }
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    return next(err);
  }
};
