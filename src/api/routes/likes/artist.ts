import { Router } from 'express';
import { body } from 'express-validator';

import * as artistsController from '../../controllers/likes/artists';
import Artist from '../../../models/likes/artist';
import isAuth from '../../middlewares/isAuth';

const route = Router();

route.get('/', [], artistsController.getArtists);
route.get('/:artistId', [], artistsController.getArtist);
route.put(
  '/',
  isAuth,
  [
    body('name')
      .trim()
      .not()
      .isEmpty(),
  ],
  artistsController.addArtist,
);
route.put('/:artistId', [], artistsController.editArtist);
route.delete('/:artistId', [], artistsController.deleteArtist);

export default route;
