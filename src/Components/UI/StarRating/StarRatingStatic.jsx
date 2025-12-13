import { memo } from "react";
import classes from "./StarRating.module.css";

const StarRatingStatic = ({ rating }) => {
  return (
    <div className={classes.star_rating}>
      {[...Array(5)].map((star, index) => {
        index += 1;
        return (
          <div
            key={index}
            className={index <= rating ? `${classes.on}` : `${classes.off}`}
          >
            <span className="star fs-2">&#9733;</span>
          </div>
        );
      })}
    </div>
  );
};

export default memo(StarRatingStatic);
