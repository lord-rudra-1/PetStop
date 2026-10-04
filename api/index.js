// Force Vercel's bundler to include these packages
// (Sequelize loads them dynamically via a variable, which the bundler can't trace)
require('pg');
require('pg-hstore');

const app = require('../backend/server.js');
module.exports = app;
