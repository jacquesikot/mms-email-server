const nodeHtmlToImage = require('node-html-to-image');

const returnImage = async (name, html, content) => {
  try {
    await nodeHtmlToImage({
      output: __dirname + `/htmlImages/${name}`,
      html: html,
      content,
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports = returnImage;
