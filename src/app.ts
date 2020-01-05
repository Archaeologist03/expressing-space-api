import express from 'express';

import authRoute from './api/routes/auth';

// Create Express server
const app = express();

// Controllers (route handlers)

// Connect to MongoDB

// Express configuration
app.set('port', process.env.PORT || 5000);
app.use(express.json());

// API Routes
app.use('/auth', authRoute);

export default app;
