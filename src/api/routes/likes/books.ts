import { Router } from 'express';

import * as booksController from '../../controllers/likes/books';

const route = Router();

route.get('/', [], booksController.getBooks);
route.get('/:bookId', [], booksController.getBook);
route.post('/', [], booksController.addBook);
route.put('/:bookId', [], booksController.editBook);
route.delete('/', [], booksController.deleteBook);

export default route;
