import { Router, Request, Response, NextFunction } from 'express';
import { body } from 'express-validator';

import * as profileController from '../controllers/profile';
import User from '../../models/user';

const route = Router();

route.get('/', [], profileController.getProfiles);
route.get('/:profileId', [], profileController.getProfile);
route.put('/', [], profileController.updateProfile);
route.delete('/', [], profileController.deleteProfile);

export default route;
