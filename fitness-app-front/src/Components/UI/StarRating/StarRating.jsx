import { useState, memo, useEffect } from "react";
import classes from "./StarRating.module.css";

const StarRating = ({ rating: externalRating, onRatingChange }) => {
  // Используем внешний рейтинг если передан, иначе внутреннее состояние
  const [internalRating, setInternalRating] = useState(0);
  const [hover, setHover] = useState(0);
  
  const rating = externalRating !== undefined ? externalRating : internalRating;
  
  // Сбрасываем hover при изменении rating
  useEffect(() => {
    if (rating === 0) {
      setHover(0);
    }
  }, [rating]);
  
  const handleRatingClick = (newRating) => {
    if (onRatingChange) {
      onRatingChange(newRating);
    } else {
      setInternalRating(newRating);
    }
  };
  
  return (
    <div className={classes.star_rating}>
      {[...Array(5)].map((star, index) => {
        index += 1;
        return (
          <button
            type="button"
            key={index}
            className={
              index <= (hover || rating) ? `${classes.on}` : `${classes.off}`
            }
            onClick={() => handleRatingClick(index)}
            onMouseEnter={() => setHover(index)}
            onMouseLeave={() => setHover(rating)}
          >
            <span className="star fs-2">&#9733;</span>
          </button>
        );
      })}
    </div>
  );
};

export default memo(StarRating);
