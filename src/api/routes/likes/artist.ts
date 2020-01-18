import { Router } from 'express';

import * as artistsController from '../../controllers/likes/artists';
import isAuth from '../../middlewares/isAuth';

const route = Router();

route.get('/', [], artistsController.getArtists);
route.get('/:artistId', [], artistsController.getArtist);
route.post('/', isAuth, [], artistsController.addArtist);
route.put('/:artistId', [], artistsController.editArtist);
route.delete('/:artistId', [], artistsController.deleteArtist);

export default route;
