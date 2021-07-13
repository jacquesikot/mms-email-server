const express = require('express');
const router = express.Router();

const generateQrCode = require('../services/qrcode');

const sendEmail = require('../services/email');

router.get('/', async (req, res) => {
  res.send('mail endpoint fine');
});

router.post('/', async (req, res) => {
  const qrCode = await generateQrCode(req.body.url);

  const data = {
    recipient: req.body.recipient,
    wardName: req.body.wardName,
    studentName: req.body.studentName,
    studentClass: req.body.studentClass,
    qrCode,
  };

  try {
    await sendEmail(data);
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
