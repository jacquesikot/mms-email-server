const express = require('express');
const router = express.Router();

const sendEmail = require('../services/email');

router.get('/', (req, res) => {
  res.send('mail endpoint fine');
});

router.post('/', async (req, res) => {
  try {
    await sendEmail(req.body.recipient);
    res.status(200).json({
      status: 200,
      data: 'Message sent Succesfully!',
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      status: 400,
      message: 'Error sending email',
    });
  }
});

module.exports = router;