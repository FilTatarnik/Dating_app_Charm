import React from 'react';
import '../App.css';
import '../index.css';

function ChatMessage({ message }) {
  const messageClass = message.isCurrentUser ? 'sent' : 'received';
  
  return (
    <div className={`message ${messageClass}`}>
      <p>{message.content}</p>
    </div>
  );
}

export default ChatMessage;