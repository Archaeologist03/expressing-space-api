import { Router } from 'express';
import { body } from 'express-validator';

import * as moviesController from '../../controllers/likes/movie';
import isAuth from '../../middlewares/isAuth';

const route = Router();

route.get('/', isAuth, [], moviesController.getMovies);
route.get('/:movieId', isAuth, [], moviesController.getMovie);
route.put(
  '/',
  isAuth,
  [
    body('title')
      .trim()
      .not()
      .isEmpty()
      .isString(),
  ],
  moviesController.addMovie,
);
route.put('/:movieId', isAuth, [], moviesController.editMovie);
route.delete('/:movieId', isAuth, [], moviesController.deleteMovie);

export default route;
