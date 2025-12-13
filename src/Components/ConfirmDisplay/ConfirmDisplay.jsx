import React, { useState } from "react";
import { Link } from "react-router-dom";

import { useStores } from "../../Store/StoreProvider";

import { observer } from "mobx-react";
import { toJS } from "mobx";

import { format } from "date-fns";

import classes from "./ConfirmDisplay.module.css";
import "../../GlobalStyles.css";

import trainers from "../../mock/Trainers";
// UI
import InnerButton from "../UI/Buttons/InnerButton/InnerButton";
import TextButton from "../UI/Buttons/TextButton/TextButton";
import TextInput from "../UI/Inputs/TextInput/TextInput";
import TrainerItem from "../TrainerItem/TrainerItem";

export const ConfirmDisplay = observer(() => {
  const { userStore } = useStores();

  const { user, bookedSlots, removeBookedSlots } = userStore;
  const { user_id, name, phone_number, email } = user;

  console.log("booked: ", toJS(bookedSlots));

  const [formData, setFormData] = useState({
    user_id: user_id,
    name: name || "",
    phone_number: phone_number || "",
    email: email || "",
  });

  const findTrainer = (trainerId) => {
    return trainers.find((trainer) => trainer.id === trainerId);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.fullname) errors.fullname = "Введите ваше ФИО*";
    if (!formData.phone_number)
      errors.phone_number = "Введите ваш номер телефона*";
    if (!formData.email) errors.email = "Введите вашу почту*";
    return errors;
  };

  return (
    <div className={classes.pro}>
      <div className={classes.user_info_box}>
        <h2>Contact Info</h2>

        <div className={classes.info_list}>
          <div className={classes.info_list_item}>
            <h4>Name</h4>
            <TextInput
              name="name"
              value={formData.name}
              onChange={handleInputChange}
            />
          </div>

          <div className={classes.info_list_item}>
            <h4>Phone Number</h4>
            <TextInput
              name="phone_number"
              value={formData.phone_number}
              onChange={handleInputChange}
            />
          </div>

          <div className={classes.info_list_item}>
            <h4>Email</h4>
            <TextInput
              name="email"
              value={formData.email}
              onChange={handleInputChange}
            />
          </div>
        </div>
      </div>

      <div className={classes.training_info_box}>
        <h2>Selected Trainings</h2>

        <div className={classes.trainings_list}>
          {bookedSlots.map((slot) => {
            const foundTrainer = findTrainer(slot.trainerId);

            const { name, location } = foundTrainer;

            return (
              <div className={classes.trainer_card} key={slot.trainerId}>
                <div className={classes.trainer_info_box}>
                  <p>{name}</p>
                  <p>{location}</p>
                </div>

                <div className={classes.trainer_time_slots_box}>
                  {slot.timeSlots.map((timeFrame) => {
                    return (
                      <div className={classes.slot_box}>
                        <h4 key={timeFrame}>
                          {format(timeFrame, "EEEE, MMM d H:mm")}
                        </h4>

                        <TextButton
                          onClick={() =>
                            removeBookedSlots(timeFrame, slot.trainerId)
                          }
                        >
                          Delete
                        </TextButton>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <Link to="/payment" className="link-decoration-remover">
        <InnerButton>Confirm</InnerButton>
      </Link>
    </div>
  );
});

export default ConfirmDisplay;
