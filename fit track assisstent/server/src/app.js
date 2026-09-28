const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const apiRoutes = require('./routes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL ? process.env.CLIENT_URL.split(',') : true }));
app.use(express.json());
app.use(morgan('dev'));

app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'AI FitTrack API is running successfully',
    version: '3.0.0',
    features: ['authentication', 'workout-crud', 'search', 'ai-recommendations', 'fitness-insights', 'dashboard-analytics', 'profile-management', 'pagination-and-filters']
  });
});

app.use('/api', apiRoutes);

app.use((req, res, next) => {
  const error = new Error(`Endpoint Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
});

app.use(errorHandler);

module.exports = app;
