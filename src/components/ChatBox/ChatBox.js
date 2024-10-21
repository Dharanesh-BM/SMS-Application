



//if the below commented is the code then the message is like received side i dont know why
// const ChatBox = ({ selectedContact, messages, onSendMessage }) => {
//   const [newMessage, setNewMessage] = useState('');

//   const handleSendMessage = () => {
//     if (newMessage.trim()) {
//       const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
//       onSendMessage({ text: newMessage, time });
//       setNewMessage('');
//     }
//   };
//   return (
//     <div className="chatbox">
//       <h3>Chat with {selectedContact.name}</h3>
//       <div className="messages">
//         {messages.map((msg, index) => (
//           <Message key={index} text={msg.text} time={msg.time} />
//         ))}
//       </div>
//       <div className="message-input">
//         <input 
//           type="text" 
//           value={newMessage} 
//           onChange={(e) => setNewMessage(e.target.value)} 
//           placeholder="Type a message..." 
//         />
//         <button onClick={handleSendMessage}>Send</button>
//       </div>
//     </div>
//   );
// };
// export default ChatBox;

import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import './ChatBox.css';
import Message from '../Message/Message';

const socket = io('http://localhost:1846'); // Adjust the URL if needed

const ChatBox = ({ selectedContact, messages, onSendMessage, onReactToMessage }) => {
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    // Listen for incoming messages
    socket.on('receiveMessage', (message) => {
      // Call onSendMessage to update messages in state
      onSendMessage(message);
    });

    // Cleanup the listener when the component unmounts
    return () => {
      socket.off('receiveMessage');
    };
  }, [onSendMessage]);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const message = { text: newMessage, time, isSent: true, reaction: null };
      onSendMessage(message); // Update local state first
      socket.emit('sendMessage', message); // Send message to server
      setNewMessage('');
    }
  };

  return (
    <div className="chatbox">
      <h3>Chat with {selectedContact.name}</h3>
      <div className="messages">
        {messages.map((msg, index) => (
          <Message
            key={index}
            text={msg.text}
            time={msg.time}
            isSent={msg.isSent}
            reaction={msg.reaction}
            onReact={(reaction) => onReactToMessage(index, reaction)}
          />
        ))}
      </div>
      <div className="message-input">
        <input 
          type="text" 
          value={newMessage} 
          onChange={(e) => setNewMessage(e.target.value)} 
          placeholder="Type a message..." 
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
};

export default ChatBox;
