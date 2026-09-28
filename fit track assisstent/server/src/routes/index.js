const express = require('express');
const authRoutes = require('./authRoutes');
const workoutRoutes = require('./workoutRoutes');
const aiRoutes = require('./aiRoutes');
const dashboardRoutes = require('./dashboardRoutes');

const router = express.Router();

// Mount individual domain route groups
router.use('/auth', authRoutes);
router.use('/workouts', workoutRoutes);
router.use('/ai', aiRoutes);
router.use('/dashboard', dashboardRoutes);

module.exports = router;
