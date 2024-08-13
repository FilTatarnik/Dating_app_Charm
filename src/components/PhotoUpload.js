import React, { useState } from 'react';
import '../App.css';
import '../index.css';

function PhotoUpload({ userId }) {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileSelect = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = () => {
    if (selectedFile) {
      // Implement photo upload logic here
      console.log('Uploading file:', selectedFile.name);
      // You would typically send this file to your server here
    } else {
      alert('Please select a file first!');
    }
  };

  return (
    <div className="photo-upload">
      <input type="file" accept="image/*" onChange={handleFileSelect} />
      <button onClick={handleUpload} disabled={!selectedFile}>
        Upload Photo
      </button>
    </div>
  );
}

export default PhotoUpload;