import { memo } from "react";
import classes from "./SearchBar.module.css";

const SearchBar = ({
  placeholder = "Search...",
  style = {},
  onChange,
  className = "",
  ...props
}) => {
  return (
    <input
      type="text"
      placeholder={placeholder}
      onChange={onChange}
      className={`${classes.input_style} ${className}`.trim()}
      style={style}
      aria-label="Search"
      role="searchbox"
      {...props}
    />
  );
};

export default memo(SearchBar);
