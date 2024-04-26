const express = require('express');
const router = express.Router();

const userRoutes = require('./Auth/users');
const userLogin = require('./Auth/login');
const userSettingsRoutes = require('./Auth/user-settings');

router.use('/', userLogin);
router.use('/', userSettingsRoutes);

module.exports = router;