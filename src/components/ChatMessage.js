import React from 'react';
import '../App.css';
import '../index.css';

function ChatMessage({ message }) {
  return (
    <div className={`message ${message.sender === 'user' ? 'sent' : 'received'}`}>
      <p>{message.content}</p>
    </div>
  );
}

export default ChatMessage;