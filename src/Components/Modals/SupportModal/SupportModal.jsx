import { useState } from 'react';
import ReactDOM from 'react-dom';
import classes from './SupportModal.module.css';
import InnerButton from '../../UI/Buttons/InnerButton/InnerButton';

const SupportModal = ({ active, setActive }) => {
  if (!active) return null;

  const [message, setMessage] = useState('');

  return ReactDOM.createPortal(
    <div className={classes.modal} onClick={() => setActive(false)}>
      <div className={classes.modal_content} onClick={(e) => e.stopPropagation()}>
        <button onClick={() => setActive(false)} className={classes.close_button}>✖</button>
        <div className={classes.input_box}>
          <h4>Leave Your Message Here</h4>
          <form className={classes.message_box}>
            <textarea 
              name="message" 
              id="message" 
              placeholder="Type your message..." 
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </form>
        </div>
        <InnerButton onClick={() => console.log(message)}>Submit</InnerButton>
      </div>
    </div>,
    document.getElementById('portal')
  );
};

export default SupportModal;
