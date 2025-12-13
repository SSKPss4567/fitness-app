import { memo } from "react";
import classes from "./ReviewItem.module.css";

const ReviewItem = ({ review }) => {
  const { reviewer, comment } = review;

  return (
    <div className={classes.reviewCard}>
      <div className={classes.reviewerInfo}>
        <h4 className={classes.reviewerName}>{reviewer}</h4>
      </div>
      <div className={classes.commentBox}>
        <p>{comment}</p>
      </div>
    </div>
  );
};

export default memo(ReviewItem);
