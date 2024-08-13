import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { messageService } from '../services/api';
import ChatMessage from './ChatMessage';
import '../App.css';
import '../index.css';

function ChatInterface() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const { matchId } = useParams();

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const chatMessages = await messageService.getConversation(matchId);
        setMessages(chatMessages.data);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };
    fetchMessages();
  }, [matchId]);

  const handleSend = async () => {
    if (!newMessage.trim()) return;
    try {
      await messageService.sendMessage(matchId, newMessage);
      setMessages([...messages, { content: newMessage, sender: 'user' }]);
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div className="App">
      <div className="content-container chat-interface">
        <h1>Chat</h1>
        <div className="message-container">
          {messages.map((message, index) => (
            <ChatMessage key={index} message={message} />
          ))}
        </div>
        <div className="message-input">
          <input 
            type="text" 
            value={newMessage} 
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
          />
          <button onClick={handleSend}>Send</button>
        </div>
      </div>
    </div>
  );
}

export default ChatInterface;