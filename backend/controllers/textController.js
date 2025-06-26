const AWS = require('aws-sdk');
const Document = require('../models/Document'); // MongoDB model


const textract = new AWS.Textract({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

const extractTextFromDocument = async (bucket, key) => {
  const params = {
    Document: {
      S3Object: {
        Bucket: bucket,
        Name: key
      }
    }
  };

  return new Promise((resolve, reject) => {
    textract.detectDocumentText(params, (err, data) => {
      if (err) {
        console.error('Textract Error:', err);
        reject(err);
      } else {
        const text = data.Blocks
          .filter(block => block.BlockType === 'LINE')
          .map(block => block.Text)
          .join('\n');
        resolve(text);
      }
    });
  });
};

module.exports = { extractTextFromDocument };
