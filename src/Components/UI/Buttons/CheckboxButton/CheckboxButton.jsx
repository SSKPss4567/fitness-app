import React from "react";
import classes from "./CheckboxButton.module.css";

export default function CheckboxButton(props) {
  const { children, style, className, theme, disabled, checked, onChange } =
    props;

  return (
    <label
      className={`${classes.checkbox_button} ${
        theme === "white" ? classes.white : classes.black
      } ${className}`}
      style={style}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        className={classes.hidden_input}
      />
      <span className={classes.button}>{children}</span>
    </label>
  );
}
