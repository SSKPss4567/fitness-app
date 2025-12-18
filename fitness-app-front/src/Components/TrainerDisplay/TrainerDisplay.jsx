import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { observer } from "mobx-react";
import classes from "./TrainerDisplay.module.css";
import "../../GlobalStyles.css";

import { fetchTrainerDetail, createReview } from "../../http/dataApi";
import { useStores } from "../../Store/StoreProvider";

import ReviewItem from "../ReviewItem/ReviewItem";
import StarRating from "../UI/StarRating/StarRating";
import StarRatingStatic from "../UI/StarRating/StarRatingStatic";
import TextButton from "../UI/Buttons/TextButton/TextButton";
import ProfileImage from "../UI/ProfileImage/ProfileImage";
import SchedulePicker from "../SchedulePicker/SchedulePicker";
import InnerButton from "../UI/Buttons/InnerButton/InnerButton";
import PaginationBar from "../PaginationBar/PaginationBar";
import { useToast } from "../../hooks/useToast";
import ToastContainer from "../UI/Toast/ToastContainer";

export const TrainerDisplay = observer(() => {
  const { userStore } = useStores();
  const navigate = useNavigate();
  const { toasts, removeToast, showSuccess, showWarning } = useToast();

  const { bookedSlots, user, isLoggedIn } = userStore;
  const urlLocation = useLocation();
  const trainerId = Number(
    urlLocation.pathname.replace("/trainers/", "").split("/")[0]
  );

  const [trainer, setTrainer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [feedBackText, setFeedBackText] = useState("");
  const [rating, setRating] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [currentReviewPage, setCurrentReviewPage] = useState(1);
  const reviewsPerPage = 3;

  // Показываем уведомление при переходе со страницы подтверждения
  useEffect(() => {
    if (urlLocation.state?.successMessage) {
      console.log('Showing toast notification:', urlLocation.state.successMessage);
      
      // Небольшая задержка, чтобы компонент успел отрендериться
      setTimeout(() => {
        if (urlLocation.state.hasErrors) {
          showWarning(`${urlLocation.state.successMessage}\n\nНекоторые слоты не были созданы:\n${urlLocation.state.errors.join('\n')}`);
        } else {
          showSuccess(urlLocation.state.successMessage);
        }
        
        // Очищаем state, чтобы уведомление не показывалось при повторном рендере
        navigate(urlLocation.pathname, { replace: true, state: {} });
      }, 100);
    }
  }, [urlLocation.state, urlLocation.pathname, showSuccess, showWarning, navigate]);

  // Загрузка данных тренера
  useEffect(() => {
    const loadTrainer = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchTrainerDetail(trainerId);
        setTrainer(data);
      } catch (err) {
        console.error('Ошибка загрузки тренера:', err);
        setError('Не удалось загрузить данные тренера');
      } finally {
        setLoading(false);
      }
    };

    if (trainerId) {
      loadTrainer();
    }
  }, [trainerId]);

  // Обработчик отправки отзыва
  const handleSubmitReview = async () => {
    // Проверка авторизации
    if (!isLoggedIn || !user || !user.id) {
      // Сохраняем текущий URL для возврата после входа
      const currentPath = urlLocation.pathname;
      navigate(`/signin?next=${encodeURIComponent(currentPath)}`);
      return;
    }

    // Валидация
    if (!feedBackText.trim()) {
      setSubmitError('Пожалуйста, введите текст отзыва');
      return;
    }

    if (rating === 0) {
      setSubmitError('Пожалуйста, поставьте оценку');
      return;
    }

    setSubmitting(true);
    setSubmitError(null);

    try {
      await createReview({
        user_id: user.id,
        trainer_id: trainerId,
        text: feedBackText.trim(),
        rating: rating
      });

      // Перезагружаем данные тренера для обновления списка отзывов
      const data = await fetchTrainerDetail(trainerId);
      setTrainer(data);

      // Очищаем форму после успешной отправки
      setFeedBackText('');
      setRating(0);
      setSubmitError('');
      setCurrentReviewPage(1); // Сбрасываем на первую страницу
    } catch (err) {
      console.error('Ошибка отправки отзыва:', err);
      
      // Обработка ошибок валидации от формы
      if (err.errors) {
        // Если есть общая ошибка (non_field_errors)
        if (err.errors.__all__) {
          const errorMsg = Array.isArray(err.errors.__all__) 
            ? err.errors.__all__[0] 
            : err.errors.__all__;
          setSubmitError(errorMsg);
        } 
        // Если есть конкретные ошибки полей
        else {
          const firstError = Object.values(err.errors)[0];
          const errorMsg = Array.isArray(firstError) ? firstError[0] : firstError;
          setSubmitError(errorMsg);
        }
      } else {
        setSubmitError(err.message || 'Не удалось отправить отзыв');
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className={classes.mainDisplayBox}>
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <p>Загрузка...</p>
        </div>
      </div>
    );
  }

  if (error || !trainer) {
    return (
      <div className={classes.mainDisplayBox}>
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <p>{error || 'Тренер не найден.'}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      <div className={classes.mainDisplayBox}>
      <div className={classes.userMainBox}>
        <div className={classes.profilePicBox}>
          {trainer.image ? (
            <img 
              src={trainer.image} 
              className={classes.imageBox} 
              alt={trainer.full_name} 
            />
          ) : (
            <div className={classes.imageBox} style={{ background: '#ddd', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span>Нет фото</span>
            </div>
          )}
          <div className={classes.ratingBox}>
            <StarRatingStatic rating={trainer.rating || 0} />
            <span className={classes.ratingNumber}>{(trainer.rating || 0).toFixed(2)}</span>
          </div>
        </div>

        <div className={classes.userInfoBox}>
          <h2 className={classes.userFullName}>{trainer.full_name}</h2>
          <h4 className={classes.userSpecialties}>{trainer.specialization}</h4>
          <p className={classes.userDescription}>{trainer.description || 'Описание отсутствует'}</p>
          
          {trainer.gyms && trainer.gyms.length > 0 && (
            <>
              <h4 className={classes.userSpecialties}>Залы:</h4>
              <ul className={classes.gymsList}>
                {trainer.gyms.map((gym) => (
                  <li key={gym.id}>
                    <Link to={`/gyms/${gym.id}`} className={classes.gymLink}>{gym.name}</Link>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </div>

      <div className={classes.scheduleBox}>
        <SchedulePicker
          unavailableSlots={[]}
          availability={[]}
          trainerId={trainer.id}
          bookedSlots={trainer.booked_slots || []}
        />

        <InnerButton 
          disabled={!bookedSlots.length}
          onClick={() => {
            if (!isLoggedIn || !user || !user.id) {
              const currentPath = urlLocation.pathname;
              navigate(`/signin?next=${encodeURIComponent(currentPath)}`);
            } else {
              navigate(`/confirm?trainerId=${trainerId}`);
            }
          }}
        >
          Записаться на тренировку
        </InnerButton>
      </div>

      <div className={classes.bottomInfoBox}>
        <div className={classes.feedbackBox}>
          <h2>Отзывы</h2>

          <div className={classes.feedbackList}>
            {trainer.reviews && trainer.reviews.length > 0 ? (
              <>
                {trainer.reviews
                  .slice((currentReviewPage - 1) * reviewsPerPage, currentReviewPage * reviewsPerPage)
                  .map((review) => (
                    <ReviewItem key={review.id} review={review} />
                  ))}
                {trainer.reviews.length > reviewsPerPage && (
                  <PaginationBar
                    totalPages={Math.ceil(trainer.reviews.length / reviewsPerPage)}
                    currentPage={currentReviewPage}
                    onPageChange={setCurrentReviewPage}
                  />
                )}
              </>
            ) : (
              <p>Отзывов пока нет</p>
            )}
          </div>

          <div className={classes.leaveFeedback}>
            <h4>Оставьте ваш отзыв</h4>
            {submitError && (
              <p style={{ color: 'red', fontSize: '0.9rem' }}>{submitError}</p>
            )}
            <textarea
              id="feedback"
              onChange={(e) => setFeedBackText(e.target.value)}
              value={feedBackText}
              className={classes.feedbackTextarea}
              placeholder="Напишите ваш отзыв..."
            />
            <StarRating rating={rating} onRatingChange={setRating} />
            <TextButton 
              style={{ alignSelf: "flex-end" }}
              onClick={handleSubmitReview}
              disabled={submitting}
            >
              {submitting ? 'Отправка...' : 'Отправить'}
            </TextButton>
          </div>
        </div>
      </div>
    </div>
    </>
  );
});

export default TrainerDisplay;
