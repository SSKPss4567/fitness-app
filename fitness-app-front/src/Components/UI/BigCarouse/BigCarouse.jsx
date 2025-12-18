import { useState, useEffect, useRef } from 'react';
import './BigCarouse.css';

export default function BigCarouse({ images }) {
  const [current, setCurrent] = useState(1); // Начинаем с 1, так как 0 — это копия последнего слайда
  const [isTransitioning, setIsTransitioning] = useState(true);
  const length = images.length;
  const timeoutRef = useRef(null);

  // Добавляем копии первого и последнего слайдов для бесконечной прокрутки
  const extendedImages = [images[length - 1], ...images, images[0]];

  const nextSlide = () => {
    if (!isTransitioning) return;
    setCurrent((prev) => prev + 1);
  };

  const prevSlide = () => {
    if (!isTransitioning) return;
    setCurrent((prev) => prev - 1);
  };

  const goToSlide = (index) => {
    setIsTransitioning(true);
    setCurrent(index + 1); // Учитываем копию в начале
  };

  // Эффект для бесшовного перехода при достижении копий
  useEffect(() => {
    if (current === 0) {
      // Отключаем анимацию и мгновенно переходим к последнему оригинальному слайду
      timeoutRef.current = setTimeout(() => {
        setIsTransitioning(false);
        setCurrent(length);
      }, 800); // Ждем окончания анимации
    } else if (current === extendedImages.length - 1) {
      // Отключаем анимацию и мгновенно переходим к первому оригинальному слайду
      timeoutRef.current = setTimeout(() => {
        setIsTransitioning(false);
        setCurrent(1);
      }, 800); // Ждем окончания анимации
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [current, length, extendedImages.length]);

  // Включаем анимацию обратно после мгновенного перехода
  useEffect(() => {
    if (!isTransitioning) {
      const timeout = setTimeout(() => {
        setIsTransitioning(true);
      }, 50);
      return () => clearTimeout(timeout);
    }
  }, [isTransitioning]);

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
          style={{ 
            transform: `translateX(calc(-${current * 100}% + 25%))`,
            transition: isTransitioning ? 'transform 0.8s ease-in-out' : 'none'
          }}
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