import React, { useRef, useState, useEffect, useCallback, memo } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";

import { DotButton, useDotButton } from "./HeroDots";
import { useAutoplay } from "./useAutoplay";
import { useAutoplayProgress } from "./useAutoplayProgress";
import { PrevButton, NextButton, usePrevNextButtons } from "./HeroArrowButtons";
import "../EmblaCarousel/css/embla.css";
import classes from "./HeroCarousel.module.css";

const HeroCarousel = ({ children, options, onSlideChange }) => {
  const [emblaRef, emblaApi] = useEmblaCarousel(options, [
    Autoplay({ playOnInit: true, delay: 3000 }),
  ]);

  const progressNode = useRef(null);
  const [timer, setTimer] = useState(null);
  const [isActive, setIsActive] = useState(true);

  const { selectedIndex, scrollSnaps, onDotButtonClick } =
    useDotButton(emblaApi);

  const {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick,
  } = usePrevNextButtons(emblaApi);

  const { autoplayIsPlaying, toggleAutoplay, onAutoplayButtonClick } =
    useAutoplay(emblaApi);

  const { showAutoplayProgress } = useAutoplayProgress(emblaApi, progressNode);

  const resetTimer = useCallback(() => {
    if (timer) clearTimeout(timer);
    setTimer(
      setTimeout(() => {
        if (emblaApi && !autoplayIsPlaying) {
          toggleAutoplay(true);
        }
      }, 10000)
    ); // 30 seconds
  }, [emblaApi, autoplayIsPlaying, toggleAutoplay]);

  useEffect(() => {
    if (isActive) {
      resetTimer();
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isActive, resetTimer]);

  const handleInteraction = useCallback(
    (callback) => {
      return () => {
        if (callback) callback();
        resetTimer();
        if (autoplayIsPlaying) {
          toggleAutoplay(false);
        }
      };
    },
    [autoplayIsPlaying, toggleAutoplay, resetTimer]
  );

  useEffect(() => {
    if (!emblaApi || !onSlideChange) return;

    const onSelect = () => {
      if (emblaApi) {
        const index = emblaApi.selectedScrollSnap();
        onSlideChange(index);
      }
    };

    emblaApi.on("select", onSelect);
    onSelect();

    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onSlideChange]);

  return (
    <>
      <section className={classes.carousel}>
        <div>
          <PrevButton
            className={`${classes.carousel__button} ${classes.carousel__button__prev}`}
            onClick={handleInteraction(onPrevButtonClick)}
            // disabled={prevBtnDisabled}
          />
        </div>
        <div className={classes.carousel__viewport} ref={emblaRef}>
          <div className={classes.carousel__container}>
            {React.Children.map(children, (child, index) => (
              <div className={classes.carousel__slide} key={index}>
                <div className={classes.carousel__slide__number}>{child}</div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <NextButton
            className={`${classes.carousel__button} ${classes.carousel__button__next}`}
            onClick={handleInteraction(onNextButtonClick)}
            // disabled={nextBtnDisabled}
          />
        </div>

        <div className="embla__controls">
          <div className={classes.carousel__dots}>
            {scrollSnaps.map((_, index) => (
              <DotButton
                key={index}
                onClick={handleInteraction(() => onDotButtonClick(index))}
                className={`${classes.carousel__dot} ${
                  index === selectedIndex ? classes.carousel__dot_selected : ""
                }`}
                selected={index === selectedIndex}
              />
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default memo(HeroCarousel);
