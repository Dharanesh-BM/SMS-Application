import React, { useState } from 'react';
import './Message.css';

const reactions = ['👍', '❤️', '😂', '😮', '😢', '👏']; // Reaction emojis

const Message = ({ text, time, isSent, onReact, reaction }) => {
  const [showReactions, setShowReactions] = useState(false);

  const toggleReactions = () => {
    setShowReactions(!showReactions);
  };

  const handleReactionClick = (emoji) => {
    onReact(emoji);  // Call the parent function to set the reaction
    setShowReactions(false);  // Hide reactions picker after selection
  };

  return (
    <div className={`message ${isSent ? 'sent' : 'received'}`}>
      <div className={`message-content ${isSent ? 'sent' : 'received'}`} onClick={toggleReactions}>
        {text}
        <div className="message-time">{time}</div>
        {reaction && <div className="message-reaction">{reaction}</div>}
      </div>

      {showReactions && (
        <div className="reaction-picker pop-up-animation">
          {reactions.map((emoji, index) => (
            <span key={index} onClick={() => handleReactionClick(emoji)}>
              {emoji}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default Message;
