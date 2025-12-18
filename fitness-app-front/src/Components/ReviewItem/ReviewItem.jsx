import { memo } from "react";
import classes from "./ReviewItem.module.css";
import StarRatingStatic from "../UI/StarRating/StarRatingStatic";

const ReviewItem = ({ review }) => {
  const reviewerName = review.user?.full_name || review.reviewer || 'Аноним';
  const reviewText = review.text || review.comment || '';
  const rating = review.rating || 0;

  return (
    <div className={classes.reviewCard}>
      <div className={classes.reviewerInfo}>
        <h4 className={classes.reviewerName}>{reviewerName}</h4>
        {rating > 0 && (
          <div className={classes.ratingBox}>
            <StarRatingStatic rating={rating} />
          </div>
        )}
      </div>
      <div className={classes.commentBox}>
        <p>{reviewText}</p>
      </div>
    </div>
  );
};

export default memo(ReviewItem);
