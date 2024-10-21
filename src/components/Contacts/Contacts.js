import React, { useState } from 'react';
import './Contacts.css';
import { FaPlus, FaSearch } from 'react-icons/fa'; // Make sure to install react-icons

const Contacts = ({ contacts, onSelectContact, onAddContact }) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Filter contacts based on the search term
  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle adding a new contact
  const handleAddContact = () => {
    const newContactName = prompt("Enter the name of the new contact:");
    if (newContactName) {
      onAddContact(newContactName);
    }
  };

  return (
    <div className="contacts">
      <div className="contacts-header">
        <h3>Contacts</h3>
        <FaPlus className="icon" onClick={handleAddContact} />
      </div>
      <div className="search-container">
        <FaSearch className="search-icon" />
        <input
          type="text"
          placeholder="Search contacts..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <ul>
        {filteredContacts.map((contact) => (
          <li
            key={contact.id}
            onClick={() => onSelectContact(contact)}
            className="contact-item"
          >
            <span className={searchTerm ? 'highlight' : ''}>{contact.name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Contacts;
