import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { messageService, matchService } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import '../App.css';

function ChatInterface() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [chatPartner, setChatPartner] = useState('');
  const { matchId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch messages
        const chatMessages = await messageService.getConversation(matchId);
        const formattedMessages = chatMessages.data.map(message => ({
          ...message,
          isCurrentUser: message.sender_id === user.id
        }));
        setMessages(formattedMessages);
        
        // Fetch match details to get the chat partner's name
        const matchDetails = await matchService.getMatches();
        const currentMatch = matchDetails.data.find(match => match.id === parseInt(matchId));
        if (currentMatch) {
          setChatPartner(currentMatch.name);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, [matchId, user.id]);

  const handleSend = async () => {
    if (!newMessage.trim()) return;
    try {
      const sentMessage = await messageService.sendMessage(matchId, newMessage);
      setMessages(prevMessages => [...prevMessages, { 
        ...sentMessage.data, 
        isCurrentUser: true,
        content: newMessage 
      }]);
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleReturnToMatches = () => {
    navigate('/matches');
  };

  return (
    <div className="App">
      <div className="content-container chat-interface">
        <h1>Chat with {chatPartner || 'Match'}</h1>
        <button onClick={handleReturnToMatches} className="return-button">Return to Matches</button>
        <div className="message-container">
          {messages.map((message, index) => (
            <div key={index} className={`message ${message.isCurrentUser ? 'sent' : 'received'}`}>
              <p>{message.content}</p>
            </div>
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