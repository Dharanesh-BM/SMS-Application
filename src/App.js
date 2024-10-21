import React, { useState } from 'react';
import axios from 'axios';  // Import axios for making API calls
import './App.css';

import ChatBox from './components/ChatBox/ChatBox';
import Contacts from './components/Contacts/Contacts';
import Login from './components/login/Login';
import Registration from './components/Registration/Registration';  // Import the Registration component

function App() {
  const [contacts, setContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [messages, setMessages] = useState({});
  const [username, setUsername] = useState('');
  const [showLogin, setShowLogin] = useState(true);  // Add state to control the display of Login or Registration

  // Function to handle adding new contacts
  const handleAddContact = async (newContactEmail) => {
    try {
      const response = await axios.post('http://localhost:1846/checkUser', {
        email: newContactEmail
      });
      
      if (response.data.message === 'User exists') {
        const newContact = {
          id: contacts.length + 1,
          name: response.data.user.name,
          email: response.data.user.email,
        };
        setContacts((prevContacts) => [...prevContacts, newContact]);
        setMessages((prevMessages) => ({
          ...prevMessages,
          [newContact.id]: []
        }));
      } else {
        alert('No user found with that email.');
      }
    } catch (error) {
      console.error('Error checking user:', error);
      alert('Error occurred while checking user.');
    }
  };

  const handleSelectContact = (contact) => {
    setSelectedContact(contact);
  };

  // Function to send a message
  const handleSendMessage = (message) => {
    if (selectedContact) {
      setMessages((prevMessages) => ({
        ...prevMessages,
        [selectedContact.id]: [...(prevMessages[selectedContact.id] || []), message]
      }));
    }
  };

  // Function to handle reacting to a message
  const handleReactToMessage = (messageIndex, reaction) => {
    setMessages((prevMessages) => ({
      ...prevMessages,
      [selectedContact.id]: prevMessages[selectedContact.id].map((msg, idx) =>
        idx === messageIndex ? { ...msg, reaction } : msg
      )
    }));
  };

  // Login handler
  const handleLogin = (username) => {
    setUsername(username);
  };

  return (
    <div className="app">
      {username ? (
        <div className="chat-container">
          <div className="logged-in-content">
            <h1>Logged in as {username}</h1>
          </div>
          <div className="main-content">
            <Contacts
              contacts={contacts}
              onSelectContact={handleSelectContact}
              onAddContact={handleAddContact}
            />
            {selectedContact && (
              <ChatBox
                selectedContact={selectedContact}
                messages={messages[selectedContact.id] || []}
                onSendMessage={handleSendMessage}
                onReactToMessage={handleReactToMessage}
              />
            )}
          </div>
        </div>
      ) : (
        showLogin ? (  // Show Login or Registration form based on the state
          <Login 
            onLogin={handleLogin} 
            onSwitchToRegister={() => setShowLogin(false)}  // Switch to Registration form
          />
        ) : (
          <Registration 
            onSwitchToLogin={() => setShowLogin(true)}  // Switch back to Login form
          />
        )
      )}
    </div>
  );
}

export default App;
