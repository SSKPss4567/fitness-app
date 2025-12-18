import React, { forwardRef } from "react";
import classes from "./MessageInput.module.css";

const MessageInput = forwardRef(
  (
    {
      placeholder = "",
      style = {},
      onChange,
      className = "",
      id,
      value,
      onFocus,
      onBlur,
      ariaDescribedby,
      isRequired = false,
      isValid = true, // Add a prop to explicitly indicate validity
      ...props
    },
    ref
  ) => {
    return (
      <textarea
        ref={ref}
        className={`${classes.input_style} ${className}`}
        id={id}
        onChange={onChange}
        value={value}
        required={isRequired}
        aria-invalid={!isValid} // Set to "true" if input is invalid
        aria-describedby={ariaDescribedby}
        onFocus={onFocus}
        onBlur={onBlur}
        placeholder={placeholder}
        style={style}
        {...props}
      />
    );
  }
);

export default MessageInput;
