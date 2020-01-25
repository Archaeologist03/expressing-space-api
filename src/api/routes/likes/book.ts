import { Router } from 'express';
import { body } from 'express-validator';

import * as booksController from '../../controllers/likes/book';
import isAuth from '../../middlewares/isAuth';

const route = Router();

route.get('/', isAuth, [], booksController.getBooks);
route.get('/:bookId', isAuth, [], booksController.getBook);
route.put(
  '/',
  isAuth,
  [
    body('title')
      .trim()
      .not()
      .isEmpty()
      .isString(),
    body('author')
      .trim()
      .not()
      .isEmpty()
      .isString(),
  ],
  booksController.addBook,
);
route.put('/:bookId', isAuth, [], booksController.editBook);
route.delete('/:bookId', isAuth, [], booksController.deleteBook);

export default route;
