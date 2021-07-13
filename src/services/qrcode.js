const Qrcode = require('qrcode');

const generateQrCode = async (url) => {
  try {
    const image = await Qrcode.toDataURL(url.toString(), { width: 400 });
    return image;
  } catch (error) {
    console.log(error);
  }
};

module.exports = generateQrCode;
