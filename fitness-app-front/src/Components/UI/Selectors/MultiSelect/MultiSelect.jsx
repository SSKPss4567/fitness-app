import React, { useState, useRef, useEffect } from "react";
import classes from "./MultiSelect.module.css";

const MultiSelect = ({
  options = [],
  selectedOptions = [],
  onChange,
  placeholder = "Select options",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => setIsOpen((prev) => !prev);

  const handleSelect = (option) => {
    onChange && onChange(option);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={classes.multiSelectContainer} ref={dropdownRef}>
      <div className={classes.selectorBox} onClick={toggleDropdown}>
        {selectedOptions.length > 0 ? (
          selectedOptions.map((item) => (
            <span key={item} className={classes.selectedItem}>
              {item} <span onClick={() => handleSelect(item)}>×</span>
            </span>
          ))
        ) : (
          <span className={classes.placeholder}>{placeholder}</span>
        )}
      </div>

      {isOpen && (
        <div className={classes.dropdown}>
          {options.map((option) => (
            <div
              key={option}
              className={`${classes.option} ${
                selectedOptions.includes(option) ? classes.selected : ""
              }`}
              onClick={() => handleSelect(option)}
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MultiSelect;
