import express from 'express';
import mongoose from 'mongoose';

import { MONGODB_URI } from './utils/secrets';

// ROUTES IMPORTS
import authRoute from './api/routes/auth';
import booksRoute from './api/routes/likes/books';
import moviesRoute from './api/routes/likes/movies';
import tvShowsRoute from './api/routes/likes/tvShows';
import songsRoute from './api/routes/likes/songs';
import artistsRoute from './api/routes/likes/artists';

// Create Express server
const app = express();

// Connect to MongoDB
const mongoUrl = MONGODB_URI;

mongoose
  .connect(mongoUrl, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    dbName: 'expressing-space',
  })
  .then(() => {
    console.log('MongoDB connected..');
  })
  .catch((err) => {
    console.log(
      'MongoDB connection error. Please make sure MongoDB is running. ' + err,
    );
  });

// Express configuration
app.set('port', process.env.PORT || 5000);
app.use(express.json());

// API Routes
app.use('/auth', authRoute);
app.use('/likes/books', booksRoute);
app.use('/likes/movies', moviesRoute);
app.use('/likes/shows', tvShowsRoute);
app.use('/likes/songs', songsRoute);
app.use('/likes/artists', artistsRoute);

export default app;
