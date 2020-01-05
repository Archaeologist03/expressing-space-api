import { Router, Request, Response, NextFunction } from 'express';

const route = Router();

route.put('/signup', (req, res) => {
  console.log('Signin up');

  const data: { msg: string } = { msg: 'hey there, youre signing up' };

  res.json(data);
});

export default route;
