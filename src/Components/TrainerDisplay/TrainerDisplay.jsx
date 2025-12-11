import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { observer } from "mobx-react";
import classes from "./TrainerDisplay.module.css";
import "../../GlobalStyles.css";
import trainers from "../../mock/Trainers";

import { useStores } from "../../Store/StoreProvider";

import ReviewItem from "../ReviewItem/ReviewItem";
import StarRating from "../UI/StarRating/StarRating";
import StarRatingStatic from "../UI/StarRating/StarRatingStatic";
import TextButton from "../UI/Buttons/TextButton/TextButton";
import ProfileImage from "../UI/ProfileImage/ProfileImage";
import SchedulePicker from "../SchedulePicker/SchedulePicker";
import InnerButton from "../UI/Buttons/InnerButton/InnerButton";

export const TrainerDisplay = observer(() => {
  const { userStore } = useStores();

  const { bookedSlots } = userStore;
  const urlLocation = useLocation();
  const trainerId = Number(
    urlLocation.pathname.replace("/trainers/", "").split("/")[0]
  );
  const trainer = trainers.find((trainer) => trainer.id === trainerId);

  if (!trainer) return <p>Trainer not found.</p>;

  const { id, name, image, specialties, rating, reviews, bio, achiv } = trainer;

  const [feedBackText, setFeedBackText] = useState("");

  return (
    <div className={classes.mainDisplayBox}>
      <div className={classes.userMainBox}>
        <div className={classes.profilePicBox}>
          <img src={image} className={classes.imageBox} />
          <div className={classes.ratingBox}>
            <StarRatingStatic rating={rating} />
          </div>
        </div>

        <div className={classes.userInfoBox}>
          <h2 className={classes.userFullName}>{name}</h2>
          <h4 className={classes.userSpecialties}>{specialties.join(", ")}</h4>
          <p className={classes.userDescription}>{bio}</p>
          <h4 className={classes.userSpecialties}>Achievments:</h4>
          <ol style={{ marginLeft: "2.3rem" }}>
            {achiv.map((ach) => (
              <li>{ach}</li>
            ))}
          </ol>
        </div>
      </div>

      <div className={classes.scheduleBox}>
        <SchedulePicker
          unavailableSlots={trainer.bookedSlots}
          availability={trainer.availability}
          trainerId={id}
        />

        <Link to="/confirm" className="link-decoration-remover">
          <InnerButton disabled={!bookedSlots.length}>
            Sign up for a training session
          </InnerButton>
        </Link>
      </div>

      <div className={classes.bottomInfoBox}>
        <div className={classes.feedbackBox}>
          <h2>Feedback</h2>

          <div className={classes.feedbackList}>
            {reviews.map((review, index) => (
              <ReviewItem key={index} review={review} />
            ))}
          </div>

          <div className={classes.leaveFeedback}>
            <h4>Leave Your Feedback</h4>
            <textarea
              id="feedback"
              onChange={(e) => setFeedBackText(e.target.value)}
              value={feedBackText}
              className={classes.feedbackTextarea}
            />
            <StarRating />
            <TextButton style={{ alignSelf: "flex-end" }}>Submit</TextButton>
          </div>
        </div>
      </div>
    </div>
  );
});

export default TrainerDisplay;
