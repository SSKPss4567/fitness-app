import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { observer } from "mobx-react";
import { format, isSameDay } from "date-fns";

import { useStores } from "../../Store/StoreProvider";
import classes from "./TrainerProfileDisplay.module.css";

import trainers from "../../mock/Trainers";
import gyms from "../../mock/Gyms";

import TextButton from "../UI/Buttons/TextButton/TextButton";
import SearchBar from "../UI/SearchBar/SearchBar";
import UserCalendar from "../UserCalendar/UserCalendar";
import TextInput from "../UI/Inputs/TextInput/TextInput";
import MessageInput from "../UI/Inputs/MessageInput/MessageInput";

const TrainerProfileDisplay = () => {
  const { userStore } = useStores();
  const { user, confirmedSlots, finishedTrainings, signOut } = userStore;
  const [selectedDateSlots, setSelectedDateSlots] = useState([]);
  const [selectedDate, setSelectedDate] = useState(Date.now());

  let navigate = useNavigate();

  const onClickDayHandler = (date) => {
    const day_slots = user.bookedSlots.filter((slot) =>
      isSameDay(new Date(slot), date)
    );
    setSelectedDateSlots(day_slots);
    setSelectedDate(date);
  };

  const handleLogout = () => {
    navigate("/");
    signOut();
  };

  return (
    <div style={{marginBottom:'12rem'}} className={classes.profile_container}>
      <h2>Trainer Profile</h2>

      <div className={classes.trainer_info_box}>
        <img
          src={user.image}
          alt={user.name}
          className={classes.trainer_image}
        />
        <h4>{user.name}</h4>
        {/* <MessageInput value={user.bio} /> */}
        <p>{user.bio}</p>
        <p>{user.location}</p>
        <p>{user.phone_number}</p>
        <p>{user.email}</p>
        <TextButton onClick={handleLogout}>Logout</TextButton>
      </div>

      <div className={classes.specialties_box}>
        <h3>Specialties</h3>
        <ul>
          {user.specialties.map((specialty, index) => (
            <li key={index}>{specialty}</li>
          ))}
        </ul>
      </div>

      <div className={classes.schedule_box}>
        <h3>Manage Bookings</h3>
        <UserCalendar onClickDay={onClickDayHandler} />
        <div className={classes.selected_date_slots}>
          {selectedDateSlots.length > 0 ? (
            <div className={classes.slots_list}>
              <h4>Sessions on {format(selectedDate, "EEEE, MMM d")}</h4>
              {selectedDateSlots.map((slot, index) => (
                <p key={index}>{format(new Date(slot), "H:mm")}</p>
              ))}
            </div>
          ) : (
            <p>No sessions on {format(selectedDate, "EEEE, MMM d")}</p>
          )}
        </div>
      </div>

      <div className={classes.certifications_box}>
        <h3>Your Certifications</h3>
        <ul>
          {user.certifications.map((cert, index) => (
            <li key={index}>{cert}</li>
          ))}
        </ul>
      </div>

      <div className={classes.reviews_box}>
        <h3>Your Reviews</h3>
        {user.reviews.map((review, index) => (
          <div key={index} className={classes.review_card}>
            <p>
              <strong>{review.reviewer}:</strong> {review.comment}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default observer(TrainerProfileDisplay);
