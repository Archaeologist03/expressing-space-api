import { Router } from 'express';

import * as moviesController from '../../controllers/likes/movies';

const route = Router();

route.get('/', [], moviesController.getMovies);
route.get('/:movieId', [], moviesController.getMovie);
route.post('/', [], moviesController.addMovie);
route.put('/:movieId', [], moviesController.editMovie);
route.delete('/', [], moviesController.deleteMovie);

export default route;
