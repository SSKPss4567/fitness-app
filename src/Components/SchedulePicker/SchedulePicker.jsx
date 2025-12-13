import { useEffect, useState } from "react";
import {
  format,
  addDays,
  startOfWeek,
  endOfWeek,
  isSameDay,
  parseISO,
} from "date-fns";
import Calendar from "react-calendar";
import { useStores } from "../../Store/StoreProvider";
import "react-calendar/dist/Calendar.css";
import classes from "./SchedulePicker.module.css";
import InnerButton from "../UI/Buttons/InnerButton/InnerButton";
import CheckboxButton from "../UI/Buttons/CheckboxButton/CheckboxButton";
import { observer } from "mobx-react";

const timeSlots = [
  "09:00",
  "10:30",
  "12:00",
  "13:30",
  "15:00",
  "16:30",
  "18:00",
  "19:30",
  "21:00",
];
const availability = ["Monday", "Wednesday", "Friday"];

export const SchedulePicker = observer(
  ({ trainerId, unavailableSlots, confirmedSlots }) => {
    const { userStore } = useStores();
    const { bookedSlots } = userStore;

    const [currentWeekStart, setCurrentWeekStart] = useState(
      startOfWeek(new Date(), { weekStartsOn: 1 })
    );
    const [showCalendar, setShowCalendar] = useState(false);

    // Function to find the first available day from today
    const getFirstAvailableDay = () => {
      let day = new Date();
      while (!availability.includes(format(day, "EEEE"))) {
        day = addDays(day, 1);
      }
      return startOfWeek(day, { weekStartsOn: 1 });
    };

    // Set the initial week to the first available day
    useEffect(() => {
      setCurrentWeekStart(getFirstAvailableDay());
    }, []);

    const weekDays = Array.from({ length: 7 }, (_, i) =>
      addDays(currentWeekStart, i)
    );
    const availableWeekDays = weekDays.filter((day) =>
      availability.includes(format(day, "EEEE"))
    );

    const changeWeek = (direction) => {
      const newWeekStart = addDays(currentWeekStart, direction * 7);
      setCurrentWeekStart(newWeekStart);
    };

    const getAvailableSlots = (date) => {
      const dateStr = format(date, "yyyy-MM-dd");

      return timeSlots.map((slot) => {
        const slotDateTime = `${dateStr}T${slot}:00`;

        const isUnavailable = unavailableSlots.some(
          (unavailableSlot) =>
            isSameDay(parseISO(unavailableSlot), date) &&
            unavailableSlot.includes(slot)
        );

        const bookedSlot = bookedSlots.find(
          (entry) => entry.timeSlots && entry.timeSlots.includes(slotDateTime)
        );
        const isBooked = !!bookedSlot;
        const isBookedByOtherTrainer =
          isBooked && bookedSlot.trainerId !== trainerId;

        return { time: slot, isBooked, isBookedByOtherTrainer, isUnavailable };
      });
    };

    const bookSlot = (slot, date) => {
      const slotDateTime = `${format(date, "yyyy-MM-dd")}T${slot}:00`;

      const trainer = bookedSlots.find((slot) => slot.trainerId === trainerId);
      const isBooked = trainer
        ? trainer.timeSlots.includes(slotDateTime)
        : false;

      if (isBooked) {
        userStore.removeBookedSlots([slotDateTime], trainerId);
      } else {
        userStore.addBookedSlots(slotDateTime, trainerId);
      }
    };

    return (
      <div className={classes.container}>
        <h4>Available Time Slots</h4>

        <div className={classes.navigation_box}>
          <div className={classes.week_box}>
            <button onClick={() => changeWeek(-1)}>{"<"} Prev</button>
            <p>
              {format(currentWeekStart, "MMM d")} -{" "}
              {format(
                endOfWeek(currentWeekStart, { weekStartsOn: 1 }),
                "MMM d"
              )}
            </p>
            <button onClick={() => changeWeek(1)}>Next {">"}</button>
          </div>

          <button
            onClick={() => setShowCalendar(!showCalendar)}
            className={classes.calendar_button}
          >
            📅
          </button>
        </div>

        {showCalendar && (
          <Calendar
            onChange={(date) =>
              setCurrentWeekStart(startOfWeek(date, { weekStartsOn: 1 }))
            }
            value={currentWeekStart}
            tileDisabled={({ date }) =>
              !availability.includes(format(date, "EEEE"))
            }
          />
        )}

        <div className={classes.schedule_box}>
          <table>
            <thead>
              <tr>
                {availableWeekDays.map((day) => (
                  <th key={day}>
                    <h4>{format(day, "EEEE, MMM d")}</h4>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {timeSlots.map((time) => (
                <tr key={time}>
                  {availableWeekDays.map((day) => {
                    // const availableSlots = availableSlotsMap.get(
                    //   format(day, "yyyy-MM-dd")
                    // );
                    const availableSlots = getAvailableSlots(day);
                    const slot = availableSlots.find(
                      (slot) => slot.time === time
                    );
                    const slotDateTime = `${format(
                      day,
                      "yyyy-MM-dd"
                    )}T${time}:00`;

                    return (
                      <td key={slotDateTime}>
                        <CheckboxButton
                          theme={
                            slot.isBooked
                              ? slot.isBookedByOtherTrainer
                                ? "disabled"
                                : "black"
                              : slot.isUnavailable
                              ? "disabled"
                              : "white"
                          }
                          disabled={
                            slot.isUnavailable || slot.isBookedByOtherTrainer
                          }
                          checked={
                            slot.isBooked && !slot.isBookedByOtherTrainer
                          }
                          onChange={() =>
                            !slot.isUnavailable &&
                            !slot.isBookedByOtherTrainer &&
                            bookSlot(time, day)
                          }
                        >
                          {time}
                        </CheckboxButton>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
);

export default SchedulePicker;
