import { Router } from 'express';
import { body } from 'express-validator';

import * as tvShowsController from '../../controllers/likes/tvShow';
import isAuth from '../../middlewares/isAuth';

const route = Router();

route.get('/', isAuth, [], tvShowsController.getTvShows);
route.get('/:tvShowId', isAuth, [], tvShowsController.getTvShow);
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
  tvShowsController.addTvShow,
);
route.put('/:tvShowId', isAuth, [], tvShowsController.editTvShow);
route.delete('/:tvShowId', isAuth, [], tvShowsController.deleteTvShow);

export default route;
