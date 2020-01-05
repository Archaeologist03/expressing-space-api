import { Router, Request, Response, NextFunction } from 'express';

import * as authController from '../controllers/auth';

const route = Router();

route.put('/signup', [], authController.signup);

export default route;
