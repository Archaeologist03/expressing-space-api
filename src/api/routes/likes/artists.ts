import { Router } from 'express';

import * as artistsController from '../../controllers/likes/artists';
import isAuth from '../../middlewares/isAuth';

const route = Router();

route.get('/', isAuth, [], artistsController.getArtists);
route.get('/:artistId', [], artistsController.getArtist);
route.post('/', [], artistsController.addArtist);
route.put('/:artistId', [], artistsController.editArtist);
route.delete('/:artistId', [], artistsController.deleteArtist);

export default route;
