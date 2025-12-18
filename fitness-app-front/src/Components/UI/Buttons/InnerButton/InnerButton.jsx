import { memo } from "react";
import classes from "./InnerButton.module.css";

export default memo(function InnerButton(props) {
  const { children, style, className, theme, onClick, disabled } = props;

  return (
    <button
      className={`${classes.default_button} ${
        theme === "white" ? classes.white : classes.black
      } ${className}`}
      style={style}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
});
