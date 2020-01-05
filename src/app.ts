import express from 'express';
import mongoose, { mongo } from 'mongoose';

import { MONGODB_URI } from './utils/secrets';

import authRoute from './api/routes/auth';

// Create Express server
const app = express();

// Controllers (route handlers)

// Connect to MongoDB
const mongoUrl = MONGODB_URI;

mongoose
  .connect(mongoUrl, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
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

export default app;
