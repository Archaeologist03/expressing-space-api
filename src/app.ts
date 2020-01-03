const express = require('express');
import { Request, Response } from 'express';

const app = express();

const PORT = process.env.PORT || 5000;

const a = 22;

app.get('/', async (req: Request, res: Response) => {
  res.send({ username: 'x' });

  console.log(123);
});

app.listen(PORT, () => {
  console.log(`Server is listening on port: ${PORT}`);
});
