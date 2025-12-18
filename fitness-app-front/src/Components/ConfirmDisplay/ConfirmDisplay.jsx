import React, { useState, useEffect } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";

import { useStores } from "../../Store/StoreProvider";

import { observer } from "mobx-react";
import { toJS } from "mobx";

import { format } from "date-fns";
import { ru } from "date-fns/locale";

import classes from "./ConfirmDisplay.module.css";
import "../../GlobalStyles.css";

import { fetchTrainerDetail, createRecords } from "../../http/dataApi";
import { useToast } from "../../hooks/useToast";
import ToastContainer from "../UI/Toast/ToastContainer";
// UI
import InnerButton from "../UI/Buttons/InnerButton/InnerButton";
import TextButton from "../UI/Buttons/TextButton/TextButton";
import TextInput from "../UI/Inputs/TextInput/TextInput";
import TrainerItem from "../TrainerItem/TrainerItem";

export const ConfirmDisplay = observer(() => {
  const { userStore } = useStores();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const trainerIdFromUrl = searchParams.get('trainerId');
  const { toasts, removeToast, showSuccess, showError, showWarning } = useToast();

  const { user, bookedSlots, removeBookedSlots } = userStore;
  
  console.log("booked: ", toJS(bookedSlots));

  const [trainersData, setTrainersData] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Фильтруем слоты только для текущего тренера
  const filteredBookedSlots = trainerIdFromUrl 
    ? bookedSlots.filter(slot => slot.trainerId === Number(trainerIdFromUrl))
    : bookedSlots;

  // Проверяем авторизацию и наличие слотов при загрузке
  useEffect(() => {
    // Если пользователь не авторизован, перенаправляем на вход
    if (!user || !user.id) {
      const currentPath = window.location.pathname + window.location.search;
      navigate(`/signin?next=${encodeURIComponent(currentPath)}`);
      return;
    }

    // Если нет выбранных слотов для этого тренера, перенаправляем на страницу тренера
    if (trainerIdFromUrl && filteredBookedSlots.length === 0) {
      showWarning('Сначала выберите временные слоты');
      navigate(`/trainers/${trainerIdFromUrl}`);
      return;
    }
  }, [user, trainerIdFromUrl, filteredBookedSlots.length, navigate]);

  // Загружаем данные тренеров
  useEffect(() => {
    const loadTrainers = async () => {
      const trainerIds = [...new Set(filteredBookedSlots.map(slot => slot.trainerId))];
      const trainersMap = {};
      
      for (const trainerId of trainerIds) {
        try {
          const trainerData = await fetchTrainerDetail(trainerId);
          trainersMap[trainerId] = trainerData;
        } catch (error) {
          console.error(`Ошибка загрузки тренера ${trainerId}:`, error);
        }
      }
      
      setTrainersData(trainersMap);
    };

    if (filteredBookedSlots.length > 0) {
      loadTrainers();
    }
  }, [filteredBookedSlots.length]);

  const findTrainer = (trainerId) => {
    return trainersData[trainerId];
  };

  const handleConfirm = async () => {
    if (!trainerIdFromUrl || filteredBookedSlots.length === 0) {
      showWarning('Нет выбранных тренировок');
      return;
    }

    setSubmitting(true);

    try {
      // Получаем все временные слоты для текущего тренера
      const trainerSlot = filteredBookedSlots.find(slot => slot.trainerId === Number(trainerIdFromUrl));
      
      if (!trainerSlot || !trainerSlot.timeSlots || trainerSlot.timeSlots.length === 0) {
        showWarning('Нет выбранных временных слотов');
        setSubmitting(false);
        return;
      }

      console.log('Отправка записей:', {
        trainerId: Number(trainerIdFromUrl),
        timeSlots: trainerSlot.timeSlots
      });

      const result = await createRecords(Number(trainerIdFromUrl), trainerSlot.timeSlots);

      if (result.success) {
        // Очищаем забронированные слоты для этого тренера
        userStore.clearTrainerBookedSlots(Number(trainerIdFromUrl));
        
        // Перенаправляем на страницу тренера с сообщением об успехе
        navigate(`/trainers/${trainerIdFromUrl}`, {
          state: {
            successMessage: result.message || 'Записи успешно созданы!',
            hasErrors: result.errors && result.errors.length > 0,
            errors: result.errors
          }
        });
      } else {
        // Показываем детальные ошибки
        let errorMessage = '';
        if (result.errors && result.errors.length > 0) {
          // Форматируем ошибки для лучшей читаемости
          const formattedErrors = result.errors.map((err, index) => {
            // Улучшаем форматирование сообщений об ошибках
            let formattedErr = err;
            if (err.includes('более чем на месяц')) {
              formattedErr = `⚠️ ${err}`;
            } else if (err.includes('уже записаны')) {
              formattedErr = `⚠️ ${err}`;
            } else if (err.includes('уже занят')) {
              formattedErr = `⚠️ ${err}`;
            } else if (err.includes('прошедшее время')) {
              formattedErr = `⚠️ ${err}`;
            }
            return `${index + 1}. ${formattedErr}`;
          });
          errorMessage = 'Ошибки при создании записей:\n\n' + formattedErrors.join('\n');
        } else {
          errorMessage = result.error || 'Не удалось создать записи';
        }
        showError(errorMessage, 15000); // Увеличиваем время отображения для длинных сообщений
        setSubmitting(false);
      }
    } catch (error) {
      console.error('Ошибка создания записей:', error);
      
      // Обрабатываем ошибки из API
      let errorMessage = error.message || 'Произошла ошибка при создании записей';
      
      // Если есть детальные ошибки в объекте ошибки
      if (error.errors && Array.isArray(error.errors) && error.errors.length > 0) {
        const formattedErrors = error.errors.map((err, index) => {
          let formattedErr = err;
          if (err.includes('более чем на месяц')) {
            formattedErr = `⚠️ ${err}`;
          } else if (err.includes('уже записаны')) {
            formattedErr = `⚠️ ${err}`;
          } else if (err.includes('уже занят')) {
            formattedErr = `⚠️ ${err}`;
          } else if (err.includes('прошедшее время')) {
            formattedErr = `⚠️ ${err}`;
          }
          return `${index + 1}. ${formattedErr}`;
        });
        errorMessage = 'Ошибки при создании записей:\n\n' + formattedErrors.join('\n');
      }
      
      showError(errorMessage, 15000);
      setSubmitting(false);
    }
  };

  return (
    <>
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      <div className={classes.pro}>
      <div className={classes.training_info_box}>
        <h2>Выбранные тренировки</h2>

        <div className={classes.trainings_list}>
          {filteredBookedSlots.length > 0 ? (
            filteredBookedSlots.map((slot) => {
              const foundTrainer = findTrainer(slot.trainerId);

              if (!foundTrainer) {
                return (
                  <div className={classes.trainer_card} key={slot.trainerId}>
                    <p>Загрузка данных тренера...</p>
                  </div>
                );
              }

              const trainerName = foundTrainer.full_name || "Неизвестный тренер";
              const gymNames = foundTrainer.gyms && foundTrainer.gyms.length > 0
                ? foundTrainer.gyms.map(gym => gym.name).join(", ")
                : "Зал не указан";

              return (
                <div className={classes.trainer_card} key={slot.trainerId}>
                  <div className={classes.trainer_info_box}>
                    <p><strong>{trainerName}</strong></p>
                    <p>{gymNames}</p>
                  </div>

                  <div className={classes.trainer_time_slots_box}>
                    {slot.timeSlots.map((timeFrame, index) => {
                      return (
                        <div className={classes.slot_box} key={`${timeFrame}-${index}`}>
                          <h4>
                            {format(new Date(timeFrame), "EEEE, d MMM, HH:mm", { locale: ru })}
                          </h4>

                          <TextButton
                            onClick={() =>
                              removeBookedSlots([timeFrame], slot.trainerId)
                            }
                          >
                            Удалить
                          </TextButton>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })
          ) : (
            <p>Вы еще не выбрали тренировки</p>
          )}
        </div>
      </div>

      <InnerButton 
        onClick={handleConfirm}
        disabled={submitting || filteredBookedSlots.length === 0}
      >
        {submitting ? 'Создание записей...' : 'Подтвердить'}
      </InnerButton>
    </div>
    </>
  );
});

export default ConfirmDisplay;
