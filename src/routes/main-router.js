const express = require('express');
const router = express.Router();

// Auth / User Routes
const userRoutes = require('./auth/users');
const userSettingsRoutes = require('./auth/user-settings');
const userLoginRoutes = require('./auth/login');
const appRoutes = require('./app-routes');

router.use('/auth', userRoutes);
router.use('/auth', userSettingsRoutes);
router.use('/auth', userLoginRoutes);

// Giveaways
const getGiveaway = require('./giveaways/getGiveaway');
router.use('/giveaways', getGiveaway);
const getCompleted = require('./giveaways/getCompleted');
router.use('/giveaways', getCompleted);


// For all static file routes (e.g. Account, Explore etc.)
router.use('/', appRoutes);

module.exports = router;