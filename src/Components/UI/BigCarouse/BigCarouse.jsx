import { useState, useEffect } from 'react';
import './BigCarouse.css';

export default function BigCarouse({ images }) {
  const [current, setCurrent] = useState(1); // Начинаем с 1, так как 0 — это копия последнего слайда
  const length = images.length;

  // Добавляем копии первого и последнего слайдов
  const extendedImages = [images[length - 1], ...images, images[0]];

  const nextSlide = () => {
    setCurrent((prev) => {
      if (prev >= extendedImages.length - 1) {
        // Если это последний слайд (копия первого), переходим к оригинальному первому слайду
        return 1;
      }
      return prev + 1;
    });
  };

  const prevSlide = () => {
    setCurrent((prev) => {
      if (prev <= 0) {
        // Если это первый слайд (копия последнего), переходим к оригинальному последнему слайду
        return extendedImages.length - 2;
      }
      return prev - 1;
    });
  };

  const goToSlide = (index) => {
    setCurrent(index + 1); // Учитываем копию в начале
  };

  // Эффект для мгновенного перехода при достижении копий
  useEffect(() => {
    if (current === 0) {
      // Если текущий слайд — копия последнего, мгновенно переходим к оригинальному последнему
      setTimeout(() => {
        setCurrent(extendedImages.length - 2);
      }, 0);
    } else if (current === extendedImages.length - 1) {
      // Если текущий слайд — копия первого, мгновенно переходим к оригинальному первому
      setTimeout(() => {
        setCurrent(1);
      }, 0);
    }
  }, [current, extendedImages.length]);

  return (
    <div className="carousel">
      {/* Кнопка «назад» со стрелкой влево */}
      <button className="carousel-btn prev" onClick={prevSlide}>
        <svg style={{marginRight:"3px"}}
          width="30"
          height="30"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>

      {/* Кнопка «вперёд» со стрелкой вправо */}
      <button className="carousel-btn next" onClick={nextSlide}>
        <svg style={{marginLeft:"3px"}}
          width="30"
          height="30"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>

      <div className="slides-wrapper">
        <div
          className="slides-container"
          style={{ transform: `translateX(calc(-${current * 100}% + 25%))` }}
        >
          {extendedImages.map((image, index) => (
            <div className={`slide ${index === current ? 'active' : ''}`} key={index}>
              <img
                src={image}
                alt={`Slide ${index + 1}`}
                className="carousel-image"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="indicators">
        {images.map((_, index) => (
          <span
            key={index}
            className={`dot ${index === current - 1 ? 'active' : ''}`}
            onClick={() => goToSlide(index)}
          ></span>
        ))}
      </div>
    </div>
  );
}