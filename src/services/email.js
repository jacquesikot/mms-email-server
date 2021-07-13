const nodemail = require('nodemailer');
const { google } = require('googleapis');
const handlebars = require('handlebars');
const fs = require('fs');
const path = require('path');

const OAuth2 = google.auth.OAuth2;

const createTransporter = async () => {
  const oauthClient = new OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    'https://developers.google.com/oauthplayground'
  );

  oauthClient.setCredentials({
    refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
  });

  const accessToken = await new Promise((resolve, reject) => {
    oauthClient.getAccessToken((err, token) => {
      if (err) {
        reject('Failed to create access token :(');
      }
      resolve(token);
    });
  });

  const transporter = nodemail.createTransport({
    service: 'gmail',
    auth: {
      type: 'OAuth2',
      user: process.env.GOOGLE_MAIL,
      accessToken,
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
    },
  });

  return transporter;
};

const sendMail = async (data) => {
  const filePath = path.join(__dirname + '/templates/index.html');
  const source = fs.readFileSync(filePath, 'utf-8').toString();
  const template = handlebars.compile(source);

  const replacements = {
    wardName: data.wardName,
    studentName: data.studentName,
    studentClass: data.studentClass,
    qrCode: data.qrCode,
  };
  const htmlToSend = template(replacements);

  const mailOptions = {
    from: process.GOOGLE_MAIL,
    to: data.recipient,
    subject: `MAC MUSIC SCHOOL: SUMMER CAMP ${new Date().getFullYear()}`,
    attachDataUrls: true,
    html: htmlToSend,
    attachments: [
      {
        filename: 'logo.png',
        path: __dirname + '/templates/images/logo.png',
        cid: 'logo',
      },
    ],
  };

  try {
    const emailTransporter = await createTransporter();
    await emailTransporter.sendMail(mailOptions);
  } catch (error) {
    console.log(error);
  }
};

module.exports = sendMail;
