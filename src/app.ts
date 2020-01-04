const express = require('express');
import { Request, Response } from 'express';

const app = express();

const PORT = process.env.PORT || 5000;

const someData: { x: number; y?: number | string } = {
  x: 123,
  y: 'a',
};

app.get('/', async (req: Request, res: Response) => {
  res.send('hahah');
  res.json(someData);
});

app.listen(PORT, () => {
  console.log(`Server is listening on port: ${PORT}`);
});
