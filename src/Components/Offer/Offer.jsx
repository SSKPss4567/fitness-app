import { memo } from "react";

import classes from "./Offer.module.css";

const Offer = ({ offer }) => {
  console.log(offer);
  return (
    <div className={classes.offer}>
      <p>{offer.type}</p>
      <p>{offer.price}</p>
    </div>
  );
};

export default memo(Offer);
