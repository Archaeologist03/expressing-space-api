import { Router } from 'express';

import * as tvShowsController from '../../controllers/likes/tvShows';

const route = Router();

route.get('/', [], tvShowsController.getTvShows);
route.get('/:showId', [], tvShowsController.getTvShow);
route.post('/', [], tvShowsController.addTvShow);
route.put('/:showId', [], tvShowsController.editTvShow);
route.delete('/', [], tvShowsController.deleteTvShow);

export default route;
