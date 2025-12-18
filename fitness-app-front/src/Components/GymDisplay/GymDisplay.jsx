import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { fetchGymDetail } from "../../http/dataApi";
import { observer } from "mobx-react";
import { useStores } from "../../Store/StoreProvider";
import { useToast } from "../../hooks/useToast";
import BigCarouse from "../UI/BigCarouse/BigCarouse";
import classes from "./GymDisplay.module.css";
import "../../GlobalStyles.css";

import FilterBar from "../FilterBar/FilterBar";
import FilterSection from "../FilterBar/FilterSection/FilterSection";
import TrainerItem from "../TrainerItem/TrainerItem";
import ReviewItem from "../ReviewItem/ReviewItem";
import Offer from "../Offer/Offer";
import PaginationBar from "../PaginationBar/PaginationBar";
import SearchBar from "../UI/SearchBar/SearchBar";
import BoxSelector from "../UI/Selectors/BoxSelector/BoxSelector";
import StarRatingStatic from "../UI/StarRating/StarRatingStatic";
import StarRating from "../UI/StarRating/StarRating";
import TextButton from "../UI/Buttons/TextButton/TextButton";
import ToastContainer from "../UI/Toast/ToastContainer";
import EmblaCarousel from "../UI/Carousels/EmblaCarousel/EmblaCarousel";
import CarouselItem from "../UI/Carousels/CarouselItems/CarouselItem/CarouselItem";

const OPTIONS = { align: "start" };

const GymDisplay = observer(() => {
  const { userStore } = useStores();
  const navigate = useNavigate();
  const { toasts, removeToast, showSuccess, showError } = useToast();
  const { user, isLoggedIn } = userStore;
  const urlLocation = useLocation();
  const gymId = Number(
    urlLocation.pathname.replace("/gyms/", "").split("/")[0]
  );

  // Состояние для данных зала
  const [gym, setGym] = useState(null);
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const trainersPerPage = 4; // Четыре тренера на странице
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilters, setSelectedFilters] = useState({ speciality: "" });

  // Состояние для формы отзыва
  const [feedBackText, setFeedBackText] = useState("");
  const [rating, setRating] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [currentReviewPage, setCurrentReviewPage] = useState(1);
  const reviewsPerPage = 3;

  // Получаем уникальные специализации тренеров этого зала
  const specialities = React.useMemo(() => {
    if (!trainers || trainers.length === 0) return [];
    const uniqueSpecializations = [...new Set(trainers.map(t => t.specialization).filter(Boolean))];
    return uniqueSpecializations.sort();
  }, [trainers]);

  // Загрузка данных зала при монтировании
  useEffect(() => {
    const loadGymData = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchGymDetail(gymId);
        setGym(data);
        setTrainers(data.trainers || []);
      } catch (err) {
        console.error("Ошибка загрузки данных зала:", err);
        setError("Не удалось загрузить данные зала");
      } finally {
        setLoading(false);
      }
    };

    if (gymId) {
      loadGymData();
    }
  }, [gymId]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleFilter = (event) => {
    const { name, value } = event.target;
    setSelectedFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  // Обработчик отправки отзыва
  const handleSubmitReview = async () => {
    // Проверка авторизации
    if (!isLoggedIn || !user || !user.id) {
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
      // Отправляем отзыв на сервер
      const response = await fetch('/api/gym-reviews/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          gym_id: gymId,
          text: feedBackText.trim(),
          rating: rating
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Не удалось отправить отзыв');
      }

      // Очищаем форму
      setFeedBackText('');
      setRating(0);
      setSubmitError(null);
      setCurrentReviewPage(1);
      
      // Перезагружаем данные зала
      const updatedGym = await fetchGymDetail(gymId);
      setGym(updatedGym);
      
      // Показываем уведомление в зависимости от того, был ли отзыв создан или обновлен
      if (data.message && data.message.includes('обновлен')) {
        showSuccess('Ваш отзыв успешно обновлен!');
      } else {
        showSuccess('Отзыв успешно отправлен!');
      }
    } catch (err) {
      console.error('Ошибка отправки отзыва:', err);
      const errorMessage = err.message || 'Произошла ошибка при отправке отзыва';
      setSubmitError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  // Фильтрация тренеров
  const filteredTrainers = trainers.filter((trainer) => {
    const lowerCaseQuery = searchQuery.toLowerCase();
    const matchesSearch = searchQuery.trim() === "" ||
      trainer.full_name.toLowerCase().includes(lowerCaseQuery) ||
      trainer.specialization.toLowerCase().includes(lowerCaseQuery);
    
    const matchesSpeciality = !selectedFilters.speciality ||
      trainer.specialization === selectedFilters.speciality;

    return matchesSearch && matchesSpeciality;
  });

  // Пагинация
  const totalPages = Math.ceil(filteredTrainers.length / trainersPerPage);
  const startIndex = (currentPage - 1) * trainersPerPage;
  const endIndex = startIndex + trainersPerPage;
  const paginatedTrainers = filteredTrainers.slice(startIndex, endIndex);

  // Сброс на первую страницу при изменении фильтров
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedFilters]);

  // Состояния загрузки и ошибок
  if (loading) {
    return (
      <div className={classes.pro}>
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <p>Загрузка...</p>
        </div>
      </div>
    );
  }

  if (error || !gym) {
    return (
      <div className={classes.pro}>
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <p>{error || 'Зал не найден'}</p>
        </div>
      </div>
    );
  }

  // Подготовка изображений для карусели (только реальные изображения из БД)
  const carouselImages = gym.images && gym.images.length > 0
    ? gym.images.map(img => img.image).filter(Boolean)
    : [];

  return (
    <>
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      <div className={classes.pro}>
        <h2 className={classes.zagl}>{gym.name}</h2>
      
      {carouselImages.length > 0 ? (
        <BigCarouse images={carouselImages} />
      ) : (
        <div style={{ padding: '2rem', textAlign: 'center', background: '#f0f0f0' }}>
          <p>Изображения не загружены</p>
        </div>
      )}

      <div style={{ padding: "2rem 2.5rem" }}>
        <div className={classes.gym_info_box}>
          <h4>Местоположение</h4>
          <p>{gym.address}</p>
          
          <h4>Удобства</h4>
          {gym.amenities && gym.amenities.length > 0 ? (
            gym.amenities.map((amenity, index) => (
              <p key={index}>{amenity}</p>
            ))
          ) : (
            <p>Информация отсутствует</p>
          )}
          
          <h4>Описание</h4>
          <p>{gym.description || 'Описание отсутствует'}</p>
          
          <h4>Рейтинг</h4>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <StarRatingStatic rating={gym.rating ? parseFloat(gym.rating) : 0} />
            <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
              {gym.rating ? parseFloat(gym.rating).toFixed(1) : '0.0'}
            </span>
          </div>
        </div>

        {/* Отзывы на зал */}
        <div className={classes.reviews_section}>
          <h3>Отзывы о зале</h3>
          {gym.reviews && gym.reviews.length > 0 ? (
            <>
            <div className={classes.reviews_list}>
                {gym.reviews
                  .slice(
                    (currentReviewPage - 1) * reviewsPerPage,
                    currentReviewPage * reviewsPerPage
                  )
                  .map((review) => (
                <ReviewItem key={review.id} review={review} />
              ))}
            </div>
              {gym.reviews.length > reviewsPerPage && (
                <PaginationBar
                  totalPages={Math.ceil(gym.reviews.length / reviewsPerPage)}
                  currentPage={currentReviewPage}
                  onPageChange={setCurrentReviewPage}
                />
              )}
            </>
          ) : (
            <p style={{ textAlign: 'center', marginBottom: '2rem' }}>Отзывов пока нет</p>
          )}

          {/* Форма для написания отзыва */}
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
              placeholder="Напишите ваш отзыв о зале..."
            />
            <div className={classes.feedbackActions}>
              <StarRating rating={rating} onRatingChange={setRating} />
              <TextButton 
                onClick={handleSubmitReview}
                disabled={submitting}
              >
                {submitting ? 'Отправка...' : 'Отправить'}
              </TextButton>
            </div>
          </div>
        </div>
      </div>
      <div className={classes.gym_options_box}>
        <FilterBar bg_color="transparent">
          <SearchBar
            value={searchQuery}
            onChange={handleSearch}
            placeholder="Поиск тренера"
            className={classes.search}
          />
          <FilterSection name="Специализация">
            <BoxSelector
              options={specialities}
              onChange={handleFilter}
              selectName="speciality"
              selectId="speciality"
              placeholder="Выберите специализацию"
            />
          </FilterSection>
        </FilterBar>

        <div className={classes.gym_display_box}>
          {/* {{margin-bottom: '1.5rem' margin-left:'1.2rem'} */}
          <h2 style={{ marginBottom: "1rem", marginLeft: "1.2rem" }}>
            Наши тренеры
          </h2>
          <div className={classes.trainer_list}>
            {paginatedTrainers.length > 0 ? (
              paginatedTrainers.map((trainer) => (
                <TrainerItem key={trainer.id} trainer={trainer} />
              ))
            ) : (
              <p style={{ marginLeft: "1.2rem" }}>Тренеры не найдены</p>
            )}
          </div>
          {totalPages > 1 && (
            <PaginationBar
              totalPages={totalPages}
              currentPage={currentPage}
              onPageChange={handlePageChange}
            />
          )}
        </div>
      </div>

      {/* <div className={classes.gym_memberships}>
        <h2>Our Membership Options</h2>
        {membershipOptions.map((option) => (
          <Offer key={option.name} offer={option} />
        ))}
      </div> */}
      </div>
    </>
  );
});

export default GymDisplay;
