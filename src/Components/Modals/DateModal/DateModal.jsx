import { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import classes from './DateModal.module.css';

const DateModal = ({ active, setActive }) => {
  if (!active) return null;

  return ReactDOM.createPortal(
    <div className={classes.modal}>
      <div className={classes.modal_content}>
        <button onClick={() => setActive(false)} className={classes.close_button}>Close</button>
        <div className={classes.input_box}>
          <h4>Select Date</h4>
        </div>
      </div>
    </div>,
    document.getElementById('portal')
  );
};

export default DateModal;
