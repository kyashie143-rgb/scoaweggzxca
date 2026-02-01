import React, { useEffect } from 'react';
import './Notification.css';

const Notification = ({ message, type = 'error', isVisible, onClose }) => {
  useEffect(() => {
    if (isVisible) {
      const duration = 2000; // 2 seconds then disappear
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  return (
    <div className={`notification-overlay ${type}`}>
      <div className={`notification-card ${type}`}>
        <p>{message}</p>
      </div>
    </div>
  );
};

export default Notification;
