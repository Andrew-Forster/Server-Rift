const express = require('express');
const router = express.Router();

const userRoutes = require('./auth/users');
const userSettingsRoutes = require('./auth/user-settings');
const userLoginRoutes = require('./auth/login');
const appRoutes = require('./app-routes');

router.use('/auth', userRoutes);
router.use('/auth', userSettingsRoutes);
router.use('/auth', userLoginRoutes);

// For all static file routes (e.g. Account, Explore etc.)
router.use('/', appRoutes);

module.exports = router;