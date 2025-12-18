import React, { useEffect } from 'react';
import classes from './Toast.module.css';

const Toast = ({ message, type = 'info', onClose, duration = 3000 }) => {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  return (
    <div className={`${classes.toast} ${classes[type]}`}>
      <div className={classes.content}>
        <span className={classes.message}>{message}</span>
        <button className={classes.closeButton} onClick={onClose}>
          ×
        </button>
      </div>
    </div>
  );
};

export default Toast;

