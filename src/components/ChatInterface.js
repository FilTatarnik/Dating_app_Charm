import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { messageService } from '../services/api';
import ChatMessage from './ChatMessage';

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
    try {
      await messageService.sendMessage(matchId, newMessage);
      setNewMessage('');
      // Optionally, refetch messages or add the new message to the state
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div>
      <div className="message-container">
        {messages.map(message => (
          <ChatMessage key={message.id} message={message} />
        ))}
      </div>
      <input 
        type="text" 
        value={newMessage} 
        onChange={(e) => setNewMessage(e.target.value)}
      />
      <button onClick={handleSend}>Send</button>
    </div>
  );
}

export default ChatInterface;