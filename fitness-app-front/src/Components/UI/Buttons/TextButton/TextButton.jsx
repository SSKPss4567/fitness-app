import { memo } from "react";
import classes from "./TextButton.module.css";

export const TextButton = ({
  children,
  style = {},
  onClick,
  className = "",
  ariaLabel,
  theme,
  ...props
}) => {
  return (
    <button
      {...props}
      className={`${classes.text_button} ${
        theme === "white" ? classes.white : classes.black
      } ${className}`.trim()}
      style={{ ...style, width: style?.width, height: style?.height }}
      onClick={onClick}
      aria-label={ariaLabel || "Text button"}
    >
      {children}
    </button>
  );
};

export default memo(TextButton);
