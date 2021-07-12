const nodemail = require('nodemailer');
const { google } = require('googleapis');
const handlebars = require('handlebars');
const fs = require('fs');
const path = require('path');

// const readHTMLFile = (path, callback) => {
//   fs.readFile(path, { encoding: 'utf-8' }, function (err, html) {
//     if (err) {
//       console.log(err);
//     } else {
//       callback(null, html);
//     }
//   });
// };

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
  const filePath = path.join(
    '/Users/mac/Documents/code/mms-email-server/src//templates/index.html'
  );
  const source = fs.readFileSync(filePath, 'utf-8').toString();
  const template = handlebars.compile(source);
  const replacements = {
    username: data.username,
  };
  const htmlToSend = template(replacements);

  const mailOptions = {
    from: process.GOOGLE_MAIL,
    to: data.recipient,
    subject: 'Welcome to Mac Music School',
    html: htmlToSend,
  };

  try {
    const emailTransporter = await createTransporter();
    await emailTransporter.sendMail(mailOptions);
  } catch (error) {
    console.log(error);
  }
};

module.exports = sendMail;

// readHTMLFile(
//     '/Users/mac/Documents/code/mms-email-server/src//templates/index.html',
//     async (err, html) => {
//       if (err) {
//         console.log(err);
//       } else {
//         const template = handlebars.compile(html);
//         const replacements = {
//           username: data.username,
//         };
//         const htmlToSend = template(replacements);

//         const mailOptions = {
//           from: process.GOOGLE_MAIL,
//           to: data.recipient,
//           subject: 'Welcome to Mac Music School',
//           html: htmlToSend,
//         };

//         try {
//           const emailTransporter = await createTransporter();
//           await emailTransporter.sendMail(mailOptions);
//         } catch (error) {
//           console.log(error);
//         }
//       }
//     }
//   );
