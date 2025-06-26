const mongoose = require('mongoose');

const DocumentSchema = new mongoose.Schema({
  documentName: String,
  uploadTime: Date,
  processedTime: Date,          // ➕ Added processedTime
  userId: String,
  documentUrl: String,
  status: String,
  extractedText: String         // ➕ Added extractedText
});

module.exports = mongoose.model('Document', DocumentSchema);
