import { Request, Response, NextFunction } from 'express';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

import { I_ErrorObject } from './interfaces/IErrors';
import { MONGODB_URI } from './utils/secrets';

// ROUTES IMPORTS
import authRoute from './api/routes/auth';
import booksRoute from './api/routes/likes/books';
import moviesRoute from './api/routes/likes/movies';
import tvShowsRoute from './api/routes/likes/tvShows';
import songsRoute from './api/routes/likes/songs';
import artistsRoute from './api/routes/likes/artist';

// Create Express server
const app = express();

// MIDDLEWARES
app.use(express.json());
app.use(cors());

// Connect to MongoDB
const mongoUrl = MONGODB_URI;

console.log('stuff stufff', MONGODB_URI);

mongoose
  .connect(mongoUrl, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    dbName: 'expressing-space',
  })
  .then(() => {
    // console.log('MongoDB connected..');
  })
  .catch((err) => {
    console.log(mongoUrl);
    console.log(err);

    console.log(
      'MongoDB connection error. Please make sure MongoDB is running. ' + err,
    );
  });

// Express configuration
app.set('port', process.env.PORT || 5000);

// API Routes
app.use('/auth', authRoute);
app.use('/likes/books', booksRoute);
app.use('/likes/movies', moviesRoute);
app.use('/likes/shows', tvShowsRoute);
app.use('/likes/songs', songsRoute);
app.use('/likes/artists', artistsRoute);

// If doesnt match any of prior routes
app.use(
  (error: I_ErrorObject, req: Request, res: Response, next: NextFunction) => {
    console.log(
      'from last resort middleware.. server - (sending error to client)',
    );
    const status = error.statusCode || 500;
    const { message, data } = error;
    res.status(status).json({ message, data });
  },
);

export default app;
