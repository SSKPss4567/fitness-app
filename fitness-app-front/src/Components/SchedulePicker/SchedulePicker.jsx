import { useEffect, useState } from "react";
import {
  format,
  addDays,
  startOfWeek,
  endOfWeek,
  isSameDay,
  parseISO,
} from "date-fns";
import { ru } from "date-fns/locale";
import Calendar from "react-calendar";
import { useStores } from "../../Store/StoreProvider";
import "react-calendar/dist/Calendar.css";
import classes from "./SchedulePicker.module.css";
import InnerButton from "../UI/Buttons/InnerButton/InnerButton";
import CheckboxButton from "../UI/Buttons/CheckboxButton/CheckboxButton";
import { observer } from "mobx-react";
import Modal from "../UI/Modal/Modal";

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
  ({ trainerId, unavailableSlots, confirmedSlots, bookedSlots: serverBookedSlots }) => {
    const { userStore } = useStores();
    const { bookedSlots } = userStore;

    const [selectedDate, setSelectedDate] = useState(new Date());
    const [showCalendar, setShowCalendar] = useState(false);

    // Очищаем выбранные слоты при монтировании компонента
    useEffect(() => {
      userStore.clearTrainerBookedSlots(trainerId);
    }, [trainerId, userStore]);

    // Генерируем 3 дня начиная с выбранной даты
    const threeDays = Array.from({ length: 3 }, (_, i) =>
      addDays(selectedDate, i)
    );

    const handleDateSelect = (date) => {
      setSelectedDate(date);
      setShowCalendar(false);
    };

    const getAvailableSlots = (date) => {
      const dateStr = format(date, "yyyy-MM-dd");

      return timeSlots.map((slot) => {
        const slotDateTime = `${dateStr}T${slot}:00`;

        // Проверяем, забронирован ли слот на сервере (уже в БД)
        const isServerBooked = serverBookedSlots && serverBookedSlots.some(
          (bookedDateTime) => bookedDateTime.startsWith(slotDateTime)
        );

        const isUnavailable = unavailableSlots.some(
          (unavailableSlot) =>
            isSameDay(parseISO(unavailableSlot), date) &&
            unavailableSlot.includes(slot)
        );

        // Проверяем, выбран ли слот пользователем локально
        const bookedSlot = bookedSlots.find(
          (entry) => entry.timeSlots && entry.timeSlots.includes(slotDateTime)
        );
        const isBookedByUser = !!bookedSlot && bookedSlot.trainerId === trainerId;
        const isBookedByOtherTrainer = !!bookedSlot && bookedSlot.trainerId !== trainerId;

        return { 
          time: slot, 
          isBookedByUser,
          isBookedByOtherTrainer, 
          isServerBooked,
          isUnavailable: isUnavailable || isServerBooked
        };
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
        <h4>Доступные временные слоты</h4>

        <div className={classes.navigation_box}>
          <p className={classes.selected_date}>
            Расписание с {format(selectedDate, "d MMMM yyyy", { locale: ru })}
          </p>

          <button
            onClick={() => setShowCalendar(true)}
            className={classes.calendar_button}
          >
            📅 Выбрать дату
          </button>
        </div>

        {showCalendar && (
          <Modal onClose={() => setShowCalendar(false)}>
            <div className={classes.calendar_modal}>
              <h3>Выберите дату</h3>
              <Calendar
                onChange={handleDateSelect}
                value={selectedDate}
                minDate={new Date()}
                locale="ru-RU"
              />
            </div>
          </Modal>
        )}

        <div className={classes.schedule_box}>
          <table>
            <thead>
              <tr>
                {threeDays.map((day) => (
                  <th key={day.toISOString()}>
                    <h4>{format(day, "EEEE, d MMM", { locale: ru })}</h4>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {timeSlots.map((time) => (
                <tr key={time}>
                  {threeDays.map((day) => {
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
                            slot.isBookedByUser
                              ? "black"  // Выбрано пользователем - черный
                              : slot.isServerBooked || slot.isUnavailable || slot.isBookedByOtherTrainer
                              ? "disabled"  // Занято в БД или недоступно - серый
                              : "white"  // Свободно - белый
                          }
                          disabled={
                            slot.isServerBooked || slot.isUnavailable || slot.isBookedByOtherTrainer
                          }
                          checked={slot.isBookedByUser}
                          onChange={() =>
                            !slot.isServerBooked &&
                            !slot.isUnavailable &&
                            !slot.isBookedByOtherTrainer &&
                            !slot.isBookedByUser &&
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
