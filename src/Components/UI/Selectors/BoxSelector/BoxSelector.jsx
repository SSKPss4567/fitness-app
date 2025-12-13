import { memo } from "react";
import classes from "./BoxSelector.module.css";

const BoxSelector = ({
  className = "",
  style = {},
  selectName,
  selectId,
  options = [],
  placeholder = "Select an option",
  onChange,
  isMultiple = false,
}) => {
  return (
    <select
      name={selectName}
      id={selectId}
      className={`${classes.select_box} ${className}`}
      style={style}
      onChange={onChange}
      multiple={isMultiple}
      aria-label={selectName || "Dropdown selector"}
    >
      {!isMultiple && (
        <option value="" className={classes.base_option}>
          {placeholder}
        </option>
      )}
      {options.map((option_info, index) => (
        <option key={index} value={option_info}>
          {option_info}
        </option>
      ))}
    </select>
  );
};

export default memo(BoxSelector);
