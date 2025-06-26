import React, { useEffect, useState } from 'react';
import axios from 'axios';

const DocumentsList = () => {
  const [docs, setDocs] = useState([]);

  useEffect(() => {
    const fetchDocs = async () => {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/documents', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDocs(res.data);
    };
    fetchDocs();
  }, []);

  return (
    <div>
      <h2>Your Uploaded Documents</h2>
      <ul>
        {docs.map(doc => (
          <li key={doc._id}>
            <strong>{doc.documentName}</strong> - {doc.status}
            <a href={doc.documentUrl} target="_blank" rel="noreferrer">View</a>
            <a href={doc.documentUrl} download>Download</a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DocumentsList;

