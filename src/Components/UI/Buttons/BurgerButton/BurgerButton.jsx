import React from 'react';
import classes from './BurgerButton.module.css';

const BurgerButton = ({ onClick, className, isOpen }) => {
  return (
    <div onClick={onClick} className={`${className} ${classes.burger} ${isOpen ? classes.open : ''}`}>
      <span></span>
      <span></span>
      <span></span>
    </div>
  );
};

export default BurgerButton;