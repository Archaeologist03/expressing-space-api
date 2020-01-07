import { Router } from 'express';

import * as songsController from '../../controllers/likes/songs';

const route = Router();

route.get('/', [], songsController.getSongs);
route.get('/:songId', [], songsController.getSong);
route.post('/', [], songsController.addSong);
route.put('/:songId', [], songsController.editSong);
route.delete('/', [], songsController.deleteSong);

export default route;
