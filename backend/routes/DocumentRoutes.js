// backend/routes/documentRoutes.js
const express = require('express');
const router = express.Router();
const AWS = require('aws-sdk');
const Document = require('../models/Document');

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

// View document (stream from S3)
router.get('/view/:key', async (req, res) => {
  try {
    const key = req.params.key;
    const params = {
      Bucket: process.env.S3_BUCKET,
      Key: key
    };

    // Get the file from S3
    const fileStream = s3.getObject(params).createReadStream();
    
    // Determine content type
    const ext = key.split('.').pop().toLowerCase();
    let contentType = 'application/octet-stream';
    
    if (ext === 'pdf') contentType = 'application/pdf';
    else if (ext === 'jpg' || ext === 'jpeg') contentType = 'image/jpeg';
    else if (ext === 'png') contentType = 'image/png';
    else if (ext === 'doc') contentType = 'application/msword';
    else if (ext === 'docx') contentType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';

    // Set headers and stream the file
    res.setHeader('Content-Type', contentType);
    fileStream.pipe(res);
    
  } catch (error) {
    console.error('Error viewing file:', error);
    res.status(500).send('Error retrieving file');
  }
});

// Download document
router.get('/download/:key', async (req, res) => {
  try {
    const key = req.params.key;
    const params = {
      Bucket: process.env.S3_BUCKET,
      Key: key
    };

    // Get the document name from database
    const doc = await Document.findOne({ documentUrl: { $regex: key } });
    const filename = doc ? doc.documentName : key;

    // Get the file from S3
    const fileStream = s3.getObject(params).createReadStream();
    
    // Set download headers
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    fileStream.pipe(res);
    
  } catch (error) {
    console.error('Error downloading file:', error);
    res.status(500).send('Error downloading file');
  }
});

module.exports = router;
