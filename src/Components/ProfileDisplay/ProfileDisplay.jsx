import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { observer } from "mobx-react";
import { format, isSameDay } from "date-fns";

import { useStores } from "../../Store/StoreProvider";
import classes from "./ProfileDisplay.module.css";

import trainers from "../../mock/Trainers";
import gyms from "../../mock/Gyms";

import TextButton from "../UI/Buttons/TextButton/TextButton";
import SearchBar from "../UI/SearchBar/SearchBar";
import UserCalendar from "../UserCalendar/UserCalendar";
import Offer from "../Offer/Offer";

const ProfileDisplay = () => {
  const { userStore } = useStores();
  const { user, confirmedSlots, finishedTrainings, signOut } = userStore;
  const [userRelevantGyms, setUserRelevantGyms] = useState(new Set());
  const [selectedDateSlots, setSelectedDateSlots] = useState([]);
  const [selectedDate, setSelectedDate] = useState(Date.now());

  let navigate = useNavigate();

  const findTrainer = (trainerId) =>
    trainers.find((trainer) => trainer.id === trainerId);

  const memberships = useMemo(() => user.memberShips, [user.memberShips]);
  const slots = useMemo(() => confirmedSlots, [confirmedSlots]);

  useEffect(() => {
    const gymsSet = new Set();

    memberships.forEach((membership) => {
      const gym = gyms.find((g) => g.id === membership.gymId);
      if (gym) gymsSet.add(gym);
    });

    slots.forEach((slot) => {
      const trainer = findTrainer(slot.trainerId);
      if (trainer) {
        const trainerGym = gyms.find((g) => g.id === trainer.gymId);
        if (trainerGym) gymsSet.add(trainerGym);
      }
    });

    setUserRelevantGyms(Array.from(gymsSet));
  }, [memberships, slots]);

  const handleLogout = () => {
    navigate("/");
    signOut();
  };

  const onClickDayHandler = (date) => {
    console.log(date);
    const day_slots = user.slots.filter((slot) =>
      isSameDay(slot.timeSlot, date)
    );
    setSelectedDateSlots(day_slots);
    setSelectedDate(date);
  };

  return (
    <div style={{marginBottom:'12rem'}} className={classes.pro}>
      <h2>Profile</h2>

      <div className={classes.user_box}>
        <h2>Contact Information</h2>
        <h4>{user.name}</h4>
        <p>{user.phone_number}</p>
        <p>{user.email}</p>

        <TextButton onClick={handleLogout}>Logout</TextButton>
      </div>

      <div className={classes.schedule_box}>
        <h2>Booking Managing</h2>

        <UserCalendar onClickDay={onClickDayHandler} />

        <div className={classes.selected_date_slots}>
          {selectedDateSlots.length > 0 ? (
            <div className={classes.slots_list}>
              <h4>Slots for {format(selectedDate, "EEEE, MMM d")}</h4>
              {selectedDateSlots.map((slot) => {
                return (
                  <p key={slot.timeSlot}>{format(slot.timeSlot, "H:mm")}</p>
                );
              })}
            </div>
          ) : (
            <div>
              <h4>No slots for {format(selectedDate, "EEEE, MMM d")}</h4>
            </div>
          )}
        </div>

        <div className={classes.confirmed_slots}>
          <h2>Confirmed Slots</h2>

          {confirmedSlots.map((slot) => {
            const foundTrainer = findTrainer(slot.trainerId);
            return foundTrainer ? (
              <div className={classes.trainer_card} key={slot.trainingId}>
                <div className={classes.trainer_info_box}>
                  <p>{foundTrainer.name}</p>
                  <p>{foundTrainer.location}</p>
                  <p>{foundTrainer.contactInfo}</p>
                </div>
                <div className={classes.trainer_time_slots_box}>
                  <p key={slot.timeSlot}>
                    {format(slot.timeSlot, "EEEE, MMM d H:mm")}
                  </p>
                </div>
              </div>
            ) : null;
          })}
        </div>

        <div className={classes.finished_trainings}>
          <div className={classes.sessions_nav}>
            <h2>Finished Sessions</h2>

            <SearchBar />
          </div>

          <div className={classes.calendars_list}>
            {finishedTrainings.map((slot, index) => {
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
              ) : (
                <p>null</p>
              );
            })}
          </div>
        </div>
      </div>

      <div className={classes.user_membership_list}>
        <h2>Your memberships</h2>
        {user.memberShips.map((membership) => {
          const gym = gyms.find((g) => g.id === membership.gymId);
          return (
            <div className={classes.membership} key={membership.gymId}>
              <h4>{gym?.name || "Unknown Gym"}</h4>
              <p>{membership.type}</p>
              <p>{membership.price}</p>
            </div>
          );
        })}
      </div>

      <div className={classes.offer_list}>
        <h2>Offers</h2>
        {userRelevantGyms.length > 0 ? (
          userRelevantGyms.map((gym) => {
            const userMembershipTypes = user.memberShips.map(
              (membership) => membership.type
            );

            const filteredOptions = gym.membershipOptions
              ? gym.membershipOptions.filter(
                  (option) => !userMembershipTypes.includes(option.type)
                )
              : [];

            return (
              <div className={classes.offers_box} key={gym.id}>
                <h4>{gym.name}</h4>
                {filteredOptions.length > 0 ? (
                  filteredOptions.map((option, index) => (
                    <Offer offer={option} key={index}></Offer>
                  ))
                ) : (
                  <p>No new offers available</p>
                )}
              </div>
            );
          })
        ) : (
          <p>No relevant gym offers</p>
        )}
      </div>
    </div>
  );
};

export default observer(ProfileDisplay);
