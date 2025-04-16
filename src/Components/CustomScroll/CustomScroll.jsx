import classes from "./CustomScroll.module.css";

export default function CustomScroll({ children }) {
  return <div className={classes.customScroll}>{children}</div>;
}
