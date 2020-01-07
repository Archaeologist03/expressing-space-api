import { Request, Response, NextFunction } from 'express';

// Get all books from current user
export const getBooks = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.log('getting getBooks ');
  res.json({ msg: 'hi from getBooks' });
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

// Add a book to a collection
export const addBook = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.log('add addBook ');
  res.json({ msg: 'hi from addBook ' });
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

// Delete book
export const deleteBook = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.log('deleting deleteBook ');
  res.json({ msg: 'hi from deleteBook' });
};
