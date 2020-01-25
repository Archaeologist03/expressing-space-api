import { Router } from 'express';
import { body } from 'express-validator';

import * as songsController from '../../controllers/likes/song';
import isAuth from '../../middlewares/isAuth';

const route = Router();

route.get('/', isAuth, [], songsController.getSongs);
route.get('/:songId', isAuth, [], songsController.getSong);
route.put(
  '/',
  isAuth,
  [
    body('title')
      .trim()
      .not()
      .isEmpty()
      .isString(),
    body('artist')
      .trim()
      .not()
      .isEmpty()
      .isString(),
  ],
  [],
  songsController.addSong,
);
route.put('/:songId', isAuth, [], songsController.editSong);
route.delete('/:songId', isAuth, [], songsController.deleteSong);

export default route;
