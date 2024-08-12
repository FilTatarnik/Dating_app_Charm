import React from 'react';

function ChatMessage({ message }) {
  return (
    <div className="message">
      <p>{message.content}</p>
    </div>
  );
}

export default ChatMessage;