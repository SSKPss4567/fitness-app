import React from "react";
import { useNavigate } from "react-router-dom";
import { observer } from "mobx-react";
import { format } from "date-fns";

import { useStores } from "../../Store/StoreProvider";
import classes from "./ProfileDisplay.module.css";

import trainers from "../../mock/Trainers";
import TextButton from "../UI/Buttons/TextButton/TextButton";

const ProfileDisplay = () => {
  const { userStore } = useStores();
  const { user, confirmedSlots, finishedTrainings, signOut } = userStore;

  const navigate = useNavigate();

  const findTrainer = (trainerId) =>
    trainers.find((trainer) => trainer.id === trainerId);

  const handleLogout = () => {
    navigate("/");
    signOut();
  };

  return (
    <div className={classes.pro}>
      <h2>Profile</h2>

      <div className={classes.user_box}>
        <h2>Contact Information</h2>
        <h4>{user.name}</h4>
        <p>{user.phone_number}</p>
        <p>{user.email}</p>

        <TextButton onClick={handleLogout}>Logout</TextButton>
      </div>

      <div className={classes.section}>
        <h2>Upcoming Sessions</h2>
        {confirmedSlots.length > 0 ? (
          confirmedSlots.map((slot) => {
            const foundTrainer = findTrainer(slot.trainerId);
            return foundTrainer ? (
              <div className={classes.trainer_card} key={slot.trainingId}>
                <div className={classes.trainer_info_box}>
                  <p>{foundTrainer.name}</p>
                  <p>{foundTrainer.location}</p>
                  {foundTrainer.contactInfo && <p>{foundTrainer.contactInfo}</p>}
                </div>
                <div className={classes.trainer_time_slots_box}>
                  <p>{format(slot.timeSlot, "EEEE, MMM d H:mm")}</p>
                </div>
              </div>
            ) : null;
          })
        ) : (
          <p className={classes.empty}>No upcoming sessions</p>
        )}
      </div>

      <div className={classes.section}>
        <h2>Session History</h2>
        {finishedTrainings.length > 0 ? (
          finishedTrainings.map((slot) => {
            const foundTrainer = findTrainer(slot.trainerId);
            return foundTrainer ? (
              <div className={classes.trainer_card} key={slot.trainingId}>
                <div className={classes.trainer_info_box}>
                  <p>{foundTrainer.name}</p>
                  <p>{foundTrainer.location}</p>
                </div>
                <div className={classes.trainer_time_slots_box}>
                  <p>{format(slot.timeSlot, "EEEE, MMM d H:mm")}</p>
                </div>
              </div>
            ) : null;
          })
        ) : (
          <p className={classes.empty}>No past sessions</p>
        )}
      </div>
    </div>
  );
};

export default observer(ProfileDisplay);
