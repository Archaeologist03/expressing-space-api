import { Router, Request, Response, NextFunction } from 'express';

import * as likesController from '../controllers/likes';

const route = Router();

route.get('/', [], likesController.getLikes);
route.get('/:likeId', [], likesController.getLike);
route.post('/', [], likesController.addLike);
route.put('/:likeId', [], likesController.updateLike);
route.delete('/', [], likesController.deleteLike);

export default route;
