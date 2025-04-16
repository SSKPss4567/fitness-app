// FilterSection.js
import { memo } from "react";
import classes from "./FilterSection.module.css"; // Use appropriate styles

const FilterSection = ({ name, children }) => {
  return (
    <div className={classes.filter_group}>
      <h4 className={classes.filter_title}>{name}</h4>
      {children}
    </div>
  );
};

export default memo(FilterSection);
