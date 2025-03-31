const express = require('express');
const router = express.Router();
const { getCredentials } = require('../Controller/AdminControllerSQL');

router.get('/credentials', getCredentials);

module.exports = router; 