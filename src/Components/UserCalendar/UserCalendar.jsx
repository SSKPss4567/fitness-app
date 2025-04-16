import React, { useState } from "react";

import {
  format,
  addDays,
  startOfWeek,
  endOfWeek,
  isSameDay,
  parseISO,
} from "date-fns";

import { observer } from "mobx-react";
import { useStores } from "../../Store/StoreProvider";

import { Calendar } from "react-calendar";
import classes from "./UserCalendar.module.css";

import InnerButton from "../UI/Buttons/InnerButton/InnerButton";

const UserCalendar = ({ onClickDay }) => {
  const { userStore } = useStores();

  const { confirmedSlots, finishedTrainings } = userStore;

  const [currentWeekStart, setCurrentWeekStart] = useState(
    startOfWeek(new Date(), { weekStartsOn: 1 })
  );

  const changeWeek = (direction) => {
    setCurrentWeekStart(addDays(currentWeekStart, direction * 7));
  };

  return (
    <Calendar
      onChange={(date) =>
        setCurrentWeekStart(startOfWeek(date, { weekStartsOn: 1 }))
      }
      value={currentWeekStart}
      onClickDay={onClickDay}
    />
  );
};

export default UserCalendar;