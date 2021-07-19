const express = require('express');

const home = require('../routes/home');
const mail = require('../routes/sendMail');
const tutorMail = require('../routes/sendTutorMail');
const error = require('../middlewares/error');

module.exports = function (app) {
  app.use(express.json());

  app.use('/', home);
  app.use('/sendMail', mail);
  app.use('/tutorMail', tutorMail);

  // Error Middleware
  app.use(error);
};
