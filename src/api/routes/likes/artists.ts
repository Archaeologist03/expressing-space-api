import { Router } from 'express';

import * as artistsController from '../../controllers/likes/artists';

const route = Router();

route.get('/', [], artistsController.getArtists);
route.get('/:artistId', [], artistsController.getArtist);
route.post('/', [], artistsController.addArtist);
route.put('/:artistId', [], artistsController.editArtist);
route.delete('/', [], artistsController.deleteArtist);

export default route;
