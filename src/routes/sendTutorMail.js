const express = require('express');
const router = express.Router();

const generateQrCode = require('../services/qrcode');

const sendTutorMail = require('../services/tutorEmail');

router.get('/', async (req, res) => {
  res.send('tutor mail endpoint fine');
});

router.post('/', async (req, res) => {
  const qrCode = await generateQrCode(req.body.url);

  const data = {
    recipient: req.body.recipient,
    name: req.body.name,
    class: req.body.class,
    qrCode,
  };

  try {
    await sendTutorMail(data);
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
