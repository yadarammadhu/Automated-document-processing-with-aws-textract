import React, { useState } from 'react';
import axios from 'axios';
import { FiUpload, FiCheckCircle, FiXCircle } from 'react-icons/fi';

const UploadForm = () => {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState({ message: '', type: '' });

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      setStatus({ message: 'Please select a file first', type: 'error' });
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      setStatus({ message: 'Uploading document...', type: 'loading' });
      const res = await axios.post('http://localhost:5000/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setStatus({ message: 'Document processed successfully!', type: 'success' });
      setFile(null);
      // Reset file input
      e.target.reset();
    } catch (err) {
      console.error(err);
      setStatus({ message: 'Upload failed. Please try again.', type: 'error' });
    }
  };

  return (
    <div>
      <form onSubmit={handleUpload}>
        <div className="form-group">
          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            className="form-control"
            accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
            required
          />
          <small className="text-muted">Supported formats: PDF, JPG, PNG, DOCX</small>
        </div>
        <button type="submit" className="btn btn-primary">
          <FiUpload /> Process Document
        </button>
      </form>

      {status.message && (
        <div className={`status-message status-${status.type}`}>
          {status.type === 'success' ? (
            <FiCheckCircle style={{ marginRight: '8px' }} />
          ) : status.type === 'error' ? (
            <FiXCircle style={{ marginRight: '8px' }} />
          ) : null}
          {status.message}
        </div>
      )}
    </div>
  );
};

export default UploadForm;
