import { Router, Request, Response, NextFunction } from 'express';

import * as authController from '../controllers/auth';

const route = Router();

route.post('/signup', [], authController.signup);

route.post('/login', [], authController.login);

export default route;
