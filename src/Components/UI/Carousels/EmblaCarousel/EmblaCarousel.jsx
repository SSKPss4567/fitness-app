import React, { memo } from "react";
import useEmblaCarousel from "embla-carousel-react";
import {
  PrevButton,
  NextButton,
  usePrevNextButtons,
} from "./EmblaCarouselArrowButtons";
import "./css/embla.css";

const EmblaCarousel = ({ children, options }) => {
  const [emblaRef, emblaApi] = useEmblaCarousel(options);
  const {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick,
  } = usePrevNextButtons(emblaApi);

  return (
    <section className="embla">
      {!prevBtnDisabled && <PrevButton onClick={onPrevButtonClick} />}
      <div className="embla__viewport" ref={emblaRef}>
        <div className="embla__container">
          {React.Children.map(children, (child, index) => (
            <div className="embla__slide" key={index}>
              <div className="embla__slide__number">{child}</div>
            </div>
          ))}
        </div>
      </div>
      {!nextBtnDisabled && <NextButton onClick={onNextButtonClick} />}
    </section>
  );
};

export default memo(EmblaCarousel);
