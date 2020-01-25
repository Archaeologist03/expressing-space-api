import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';

import Book from '../../../models/likes/book';
import { I_ErrorObject } from '../../../interfaces/IErrors';

// -------------------------------------------------------
// @GET /likes/books/
// Protected
// GET BOOKS FROM CURRENT USER
export const getBooks = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const currentPage = req.query.page || 1;
  const perPage = 2;

  try {
    // @ts-ignore
    const userId = req.userId;
    const totalItems = await Book.find({
      users: { _id: userId },
    }).countDocuments();

    // Find only ones that has current user id
    const books = await Book.find({
      users: { _id: userId },
    })
      .skip((currentPage - 1) * perPage)
      .limit(perPage)
      .select('-users');

    res.status(200).json({
      message: 'Fetched current user Books.',
      userId,
      books,
      totalItems,
    });
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};

// Get single book  ####Might not need
export const getBook = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.log('getting single getBook ');
  res.json({ msg: 'hi from getBook' });
};

// -------------------------------------------------------
// @PUT /likes/books/
// Protected
// ADD NEW BOOK OR UPDATE USERS FIELD IN EXISTING BOOK
export const addBook = async (
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
  const { title, author } = req.body;

  const findBookInDb = await Book.findOne({ title, author });

  // ==== If book exist in db ====
  if (findBookInDb) {
    const usersList = await findBookInDb.get('users');
    const doesUserExist = usersList.includes(userId.toString());

    //  If userId exists in users array
    if (doesUserExist) {
      const error: I_ErrorObject = new Error(
        'This user ID already exists in this artist users.',
      );
      error.statusCode = 409;
      return next(error);
    }
    // Book exists but current user ID is not there - user didnt added this book yet
    else {
      const addedBook = await Book.findOneAndUpdate(
        { title, author },
        { $push: { users: { _id: userId } } },
        { new: true },
      );

      return res.status(201).json({
        message: 'UserId added to Book successfully.',
        book: {
          title: addedBook.title,
          // @ts-ignore
          author: addBook.author,
          _id: addedBook._id,
        },
      });
    }
  }

  const newBook = new Book({
    title,
    author,
    users: [userId],
  });

  // ==== Book doesn't exist in db ====
  try {
    const addedBook = await (await newBook.save()).toObject();
    return res.status(201).json({
      message: 'Book added successfully.',
      book: {
        title: addedBook.title,
        author: addedBook.author,
        _id: addedBook._id,
      },
    });
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};

// Edit/update/rename a book instance
export const editBook = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.log('updating editBook ');
  res.json({ msg: 'hi from editBook' });
};

// -------------------------------------------------------
// @DELETE /likes/books/:bookId
// Protected
// DELETE CURRENT USER ID FROM SELECTED BOOK - IF USERS ARRAY EMPTY = DELETE WHOLE BOOK FROM DB
export const deleteBook = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // @ts-ignore
  const { userId } = req;
  const bookId = req.params.bookId;

  try {
    const findBookInDb = await Book.findById(bookId);

    // ==== If book exist in db ====
    if (findBookInDb) {
      const usersList = await findBookInDb.get('users');
      const doesUserExist = usersList.includes(userId.toString());

      //  If userId doesn't exist in artist
      if (!doesUserExist) {
        const error: I_ErrorObject = new Error(
          "This user ID doesn't exist on this artist. ",
        );
        error.statusCode = 404;
        return next(error);
      } else {
        // Deleting userId from book
        const bookAfterDeletion = await Book.findByIdAndUpdate(
          bookId,
          { $pull: { users: userId } },
          { new: true },
        );

        // If users array is empty - delete book from db
        if (!bookAfterDeletion.users[0]) {
          await Book.findByIdAndDelete(bookId);
        }

        return res.status(202).json({
          message: 'UserId deleted from book',
          bookId,
        });
      }
      // Book doesn't exist in db
    } else {
      const error: I_ErrorObject = new Error("This book doesn't exist.");
      error.statusCode = 404;
      return next(error);
    }
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    return next(err);
  }
};
