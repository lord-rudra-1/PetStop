const express = require('express');
const router = express.Router();
const { getCredentials, getStats } = require('../Controller/AdminControllerSQL');

// Admin authentication routes
router.get('/credentials', getCredentials);

// Admin dashboard routes
router.get('/stats', getStats);

module.exports = router; 