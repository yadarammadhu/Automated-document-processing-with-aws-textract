import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiFileText, FiDownload, FiEye } from 'react-icons/fi';

const DocumentViewer = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const res = await axios.get('http://localhost:5000/upload/all');
        setDocuments(res.data);
      } catch (err) {
        console.error('Fetch failed:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDocuments();
  }, []);

  if (loading) {
    return <div>Loading documents...</div>;
  }

  if (documents.length === 0) {
    return <div>No documents found.</div>;
  }

  return (
    <div className="document-grid">
      {documents.map(doc => {
        // Extract filename from URL
        const filename = doc.documentUrl.split('/').pop();
        
        return (
          <div key={doc._id} className="document-card">
            <div className="card-header">
              <h3 className="card-title">
                <FiFileText />
                {doc.documentName}
              </h3>
            </div>
            <div className="card-body">
              <div className="extracted-text">{doc.extractedText || 'No text extracted'}</div>
              <div className="document-actions">
                <a 
                  href={`http://localhost:5000/documents/view/${filename}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="action-btn"
                >
                  <FiEye /> View Original
                </a>
                <a 
                  href={`http://localhost:5000/documents/download/${filename}`}
                  className="action-btn"
                >
                  <FiDownload /> Download
                </a>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default DocumentViewer;  // This is the crucial fix
