const express = require('express');
const multer = require('multer');
const AWS = require('aws-sdk');
const router = express.Router();
const Document = require('../models/Document');

// Textract setup
const textract = new AWS.Textract({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

// S3 setup
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const storage = multer.memoryStorage();
const upload = multer({ storage });

// Textract logic
const extractTextFromDocument = async (bucket, key) => {
  const params = {
    Document: {
      S3Object: {
        Bucket: bucket,
        Name: key,
      },
    },
  };

  return new Promise((resolve, reject) => {
    textract.detectDocumentText(params, (err, data) => {
      if (err) {
        console.error('Textract error:', err);
        reject(err);
      } else {
        const text = data.Blocks
          .filter((block) => block.BlockType === 'LINE')
          .map((block) => block.Text)
          .join('\n');
        resolve(text);
      }
    });
  });
};

// ✅ Upload Route
router.post('/', upload.single('file'), async (req, res) => {
  const file = req.file;
  const fileName = Date.now() + '-' + file.originalname;

  const params = {
    Bucket: process.env.S3_BUCKET,
    Key: fileName,
    Body: file.buffer,
    ContentType: file.mimetype,
  };

  try {
    // Upload to S3
    const s3Data = await s3.upload(params).promise();

    // Extract text from uploaded file using Textract
    const extractedText = await extractTextFromDocument(process.env.S3_BUCKET, fileName);

    // Save metadata + extracted text to MongoDB
    const document = new Document({
      documentName: file.originalname,
      uploadTime: new Date(),
      processedTime: new Date(),
      userId: 'user123', // Replace with actual user logic
      status: 'processed',
      documentUrl: s3Data.Location,
      extractedText: extractedText,
    });

    await document.save();

    res.status(200).json({
      message: 'File uploaded and processed with Textract',
      data: document,
    });
  } catch (err) {
    console.error('Upload/processing failed:', err);
    res.status(500).json({ error: 'Upload or processing failed' });
  }
});

// ✅ View All Documents Route
router.get('/all', async (req, res) => {
  try {
    const documents = await Document.find().sort({ uploadTime: -1 }); // latest first
    res.status(200).json(documents);
  } catch (err) {
    console.error('Error fetching documents:', err);
    res.status(500).json({ error: 'Failed to fetch documents' });
  }
});

module.exports = router;
