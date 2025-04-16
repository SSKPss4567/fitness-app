import React, { useState, Children, memo } from "react";
import classes from "./FilterBar.module.css";
import BurgerButton from "../UI/Buttons/BurgerButton/BurgerButton";

const FilterBar = ({ children, bg_color }) => {
  const [isMenuOpen, setMenuOpen] = useState(false);

  const click = () => {
    setMenuOpen(!isMenuOpen);
  };

  // Separate SearchBar from other children
  let searchComponent = null;
  const filterChildren = [];

  Children.forEach(children, (child) => {
    if (child.type && child.type.name === "SearchBar") {
      searchComponent = child;
    } else {
      filterChildren.push(child);
    }
  });

  return (
    <div
      className={`${classes.main_box} ${isMenuOpen ? classes.open : ""}`}
      style={{ backgroundColor: bg_color }}
    >
      {/* Top section with SearchBar */}
      <div className={classes.top_section}>
        {searchComponent}
        <BurgerButton
          onClick={click}
          className={classes.menu}
          isOpen={isMenuOpen}
        />
      </div>

      {/* Other filters inside filter_section */}
      <div
        className={`${classes.filter_section} ${
          isMenuOpen ? classes.open : ""
        }`}
      >
        {filterChildren}
      </div>
    </div>
  );
};

export default memo(FilterBar);
