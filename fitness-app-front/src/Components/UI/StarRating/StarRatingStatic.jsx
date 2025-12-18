import { memo } from "react";
import classes from "./StarRating.module.css";

const StarRatingStatic = ({ rating }) => {
  // Преобразуем rating в число, если это строка
  const numericRating = typeof rating === 'string' ? parseFloat(rating) : (rating || 0);
  
  return (
    <div className={classes.star_rating}>
      {[...Array(5)].map((star, index) => {
        const starIndex = index + 1;
        return (
          <div
            key={starIndex}
            className={starIndex <= numericRating ? `${classes.on}` : `${classes.off}`}
          >
            <span className="star fs-2">&#9733;</span>
          </div>
        );
      })}
    </div>
  );
};

export default memo(StarRatingStatic);
