const nodemail = require('nodemailer');
const { google } = require('googleapis');
const handlebars = require('handlebars');
const fs = require('fs');
const path = require('path');
const htmlToImage = require('./htmlToImg');

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

const readHTMLFile = (path, callback) => {
  fs.readFile(path, { encoding: 'utf-8' }, function (err, html) {
    if (err) {
      console.log(err);
    } else {
      callback(null, html);
    }
  });
};

const sendMail = async (data) => {
  readHTMLFile(
    path.join(__dirname + '/templates/index.html'),
    async (err, html) => {
      if (err) {
        console.log(err);
      } else {
        const template = handlebars.compile(html);

        const replacements = {
          wardName: data.wardName,
          studentName: data.studentName,
          studentClass: data.studentClass,
          qrCode: data.qrCode,
          logo: 'cid:logo',
        };
        const htmlToSend = template(replacements);

        const logoImg = fs.readFileSync(
          __dirname + '/templates/images/logo.png'
        );
        const base64Image = new Buffer.from(logoImg).toString('base64');
        const logoImgUri = 'data:image/jpeg;base64,' + base64Image;

        // const replacementsImg = {
        //   wardName: data.wardName,
        //   studentName: data.studentName,
        //   studentClass: data.studentClass,
        //   qrCode: data.qrCode,
        //   logo: logoImgUri,
        // };

        // const htmlToImg = template(replacementsImg);

        // const fileName = data.studentName.trim() + Math.random(5000) + '.png';

        // await htmlToImage(fileName, htmlToImg, {
        //   logo: __dirname + '/templates/images/logo.png',
        // });

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
            // {
            //   filename: fileName,
            //   path: __dirname + `/htmlImages/${fileName}`,
            //   cid: 'tag',
            // },
            // {
            //   path: logoImgUri,
            // },
          ],
        };
        try {
          const emailTransporter = await createTransporter();
          await emailTransporter.sendMail(mailOptions);
        } catch (error) {
          console.log(error);
        }
      }
    }
  );
};

module.exports = sendMail;
