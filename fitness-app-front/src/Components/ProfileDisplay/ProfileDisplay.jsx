import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { observer } from "mobx-react";
import { format, parseISO, isBefore } from "date-fns";
import { ru } from "date-fns/locale";

import { useStores } from "../../Store/StoreProvider";
import classes from "./ProfileDisplay.module.css";
import { fetchUserProfile, cancelRecord } from "../../http/dataApi";
import { useToast } from "../../hooks/useToast";
import ToastContainer from "../UI/Toast/ToastContainer";
import TextButton from "../UI/Buttons/TextButton/TextButton";
import PaginationBar from "../PaginationBar/PaginationBar";

const ProfileDisplay = () => {
  const { userStore } = useStores();
  const { user, signOut } = userStore;
  const navigate = useNavigate();
  const { toasts, removeToast, showSuccess, showError } = useToast();

  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [upcomingPage, setUpcomingPage] = useState(1);
  const [pastPage, setPastPage] = useState(1);
  const recordsPerPage = 5;

  useEffect(() => {
    const loadProfile = async () => {
      if (!user || !user.id) {
        setError("Пользователь не авторизован");
        setLoading(false);
        return;
      }

      try {
        const data = await fetchUserProfile(user.id);
        setProfileData(data);
      } catch (err) {
        console.error("Ошибка загрузки профиля:", err);
        setError("Не удалось загрузить профиль");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [user]);

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  const handleCancelRecord = async (recordId) => {
    try {
      const result = await cancelRecord(recordId);
      if (result.success) {
        // Перезагружаем профиль после отмены
        const data = await fetchUserProfile(user.id);
        setProfileData(data);
        showSuccess('Тренировка успешно отменена');
      } else {
        showError(result.error || 'Не удалось отменить тренировку');
      }
    } catch (error) {
      console.error('Ошибка отмены тренировки:', error);
      showError(error.message || 'Не удалось отменить тренировку');
    }
  };

  if (loading) {
    return <div className={classes.pro}><p>Загрузка...</p></div>;
  }

  if (error) {
    return <div className={classes.pro}><p>{error}</p></div>;
  }

  if (!profileData) {
    return <div className={classes.pro}><p>Профиль не найден</p></div>;
  }

  // Разделяем записи на предстоящие и прошедшие
  const now = new Date();
  const upcomingRecords = (profileData.records?.filter(record => {
    try {
      const recordDate = parseISO(record.datetime);
      // Предстоящие: только назначенные (не отмененные) и дата в будущем
      return record.status === 'scheduled' && !isBefore(recordDate, now);
    } catch {
      return false;
    }
  }) || []).sort((a, b) => {
    // Сортируем по дате - от ближайшей к дальнейшей
    try {
      const dateA = parseISO(a.datetime);
      const dateB = parseISO(b.datetime);
      return dateA.getTime() - dateB.getTime();
    } catch {
      return 0;
    }
  });

  const pastRecords = (profileData.records?.filter(record => {
    try {
      // История: только завершенные или отмененные тренировки
      // Тренировки автоматически переходят в статус "завершена" через 1.5 часа после начала
      return record.status === 'completed' || record.status === 'cancelled';
    } catch {
      return false;
    }
  }) || []).sort((a, b) => {
    // Сортируем по дате - от новых к старым
    try {
      const dateA = parseISO(a.datetime);
      const dateB = parseISO(b.datetime);
      return dateB.getTime() - dateA.getTime();
    } catch {
      return 0;
    }
  });

  // Пагинация для предстоящих тренировок
  const totalUpcomingPages = Math.ceil(upcomingRecords.length / recordsPerPage);
  const upcomingStartIndex = (upcomingPage - 1) * recordsPerPage;
  const upcomingEndIndex = upcomingStartIndex + recordsPerPage;
  const paginatedUpcomingRecords = upcomingRecords.slice(upcomingStartIndex, upcomingEndIndex);

  // Пагинация для истории тренировок
  const totalPastPages = Math.ceil(pastRecords.length / recordsPerPage);
  const pastStartIndex = (pastPage - 1) * recordsPerPage;
  const pastEndIndex = pastStartIndex + recordsPerPage;
  const paginatedPastRecords = pastRecords.slice(pastStartIndex, pastEndIndex);

  return (
    <>
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      <div className={classes.pro}>
      <h2>Профиль</h2>

      <div className={classes.user_box}>
        <h2>Контактная информация</h2>
        <p>{profileData.email}</p>

        <TextButton onClick={handleLogout}>Выйти</TextButton>
      </div>

      <div className={classes.section}>
        <h2>Предстоящие тренировки</h2>
        {upcomingRecords.length > 0 ? (
          <>
            {paginatedUpcomingRecords.map((record) => (
              <div className={classes.trainer_card} key={record.id}>
                <div className={classes.trainer_info_box}>
                  <p><strong>{record.trainer_name}</strong></p>
                  <p>{record.gym_name || 'Зал не указан'}</p>
                </div>
                <div className={classes.trainer_time_slots_box}>
                  <p>
                    {format(parseISO(record.datetime), "EEEE, d MMM yyyy, HH:mm", { locale: ru })}
                  </p>
                  <div className={classes.status_button_row}>
                    <div className={classes.status_badge_scheduled}>
                      Назначена
                    </div>
                    {record.status === 'scheduled' && (
                      <button 
                        className={classes.cancel_button}
                        onClick={() => handleCancelRecord(record.id)}
                      >
                        Отменить
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {totalUpcomingPages > 1 && (
              <div className={classes.pagination_wrapper}>
                <PaginationBar
                  totalPages={totalUpcomingPages}
                  currentPage={upcomingPage}
                  onPageChange={setUpcomingPage}
                />
              </div>
            )}
          </>
        ) : (
          <p className={classes.empty}>Нет предстоящих тренировок</p>
        )}
      </div>

      <div className={classes.section}>
        <h2>История тренировок</h2>
        {pastRecords.length > 0 ? (
          <>
            {paginatedPastRecords.map((record) => (
              <div 
                className={`${classes.trainer_card} ${record.status === 'cancelled' ? classes.cancelled_card : ''}`} 
                key={record.id}
              >
                <div className={classes.trainer_info_box}>
                  <p><strong>{record.trainer_name}</strong></p>
                  <p>{record.gym_name || 'Зал не указан'}</p>
                </div>
                <div className={classes.trainer_time_slots_box}>
                  <p>
                    {format(parseISO(record.datetime), "EEEE, d MMM yyyy, HH:mm", { locale: ru })}
                  </p>
                  <div className={
                    record.status === 'completed' 
                      ? classes.status_badge_completed 
                      : record.status === 'cancelled' 
                      ? classes.status_badge_cancelled 
                      : classes.status_badge_scheduled
                  }>
                    {record.status === 'completed' ? 'Завершена' : record.status === 'cancelled' ? 'Отменена' : 'Назначена'}
                  </div>
                </div>
              </div>
            ))}
            {totalPastPages > 1 && (
              <div className={classes.pagination_wrapper}>
                <PaginationBar
                  totalPages={totalPastPages}
                  currentPage={pastPage}
                  onPageChange={setPastPage}
                />
              </div>
            )}
          </>
        ) : (
          <p className={classes.empty}>Нет прошедших тренировок</p>
        )}
      </div>
    </div>
    </>
  );
};

export default observer(ProfileDisplay);
