import React from 'react';
import './App.css';
import UploadForm from './components/UploadForm';
import DocumentViewer from './components/DocumentViewer';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <div className="header-content">
          <div className="logo-container">
            <img src="/logo.jpg" alt="App Logo" className="app-logo" />
            <div className="title-container">
              <h1>Automated Document Processing</h1>
              <p className="subtitle">Powered by AWS Textract</p>
            </div>
          </div>
        </div>
      </header>

      <main className="main-content">
        <section className="upload-section">
          <div className="section-header">
            <h2>Upload a Document</h2>
            <p>Process PDFs, images, and documents with AI-powered extraction</p>
          </div>
          <UploadForm />
        </section>

        <section className="documents-section">
          <div className="section-header">
            <h2>Processed Documents</h2>
            <p>View and manage your extracted documents</p>
          </div>
          <DocumentViewer />
        </section>
      </main>

      <footer className="app-footer">
        <p>© {new Date().getFullYear()} Document Processor. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
