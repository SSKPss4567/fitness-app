import { useEffect } from "react";
import classes from "./Modal.module.css";

const Modal = ({ children, onClose }) => {
  useEffect(() => {
    // Блокируем прокрутку страницы при открытом модальном окне
    document.body.style.overflow = "hidden";
    
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className={classes.modal_backdrop} onClick={handleBackdropClick}>
      <div className={classes.modal_content}>
        <button className={classes.close_button} onClick={onClose}>
          ✕
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;

