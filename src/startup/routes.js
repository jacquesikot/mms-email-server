const express = require('express');

const home = require('../routes/home');
const error = require('../middlewares/error');

module.exports = function (app) {
  app.use(express.json());

  app.use('/', home);

  // Error Middleware
  app.use(error);
};
