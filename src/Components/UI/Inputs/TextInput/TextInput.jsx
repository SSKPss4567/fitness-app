import React, { forwardRef } from "react";

import classes from "./TextInput.module.css";

const TextInput = forwardRef(
  (
    {
      placeholder = "",
      style = {},
      onChange,
      className = "",
      type = "text",
      id,
      value,
      onFocus,
      onBlur,
      ariaDescribedby,
      validationValue,
      isRequired,
      ...props
    },
    ref
  ) => {
    return (
      <input
        ref={ref}
        className={`${classes.input_style} ${className}`}
        type={type}
        id={id}
        onChange={onChange}
        value={value}
        required={!!isRequired}
        aria-invalid={validationValue ? "false" : "true"}
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

export default TextInput;
