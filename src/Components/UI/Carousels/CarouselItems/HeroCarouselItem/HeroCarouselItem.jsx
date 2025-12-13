import { memo } from "react";
import { Link } from "react-router-dom";

import classes from "./HeroCarouselItem.module.css";
import "../../../../../GlobalStyles.css";

const HeroCarouselItem = memo((props) => {
  const { id, image, name } = props;

  return (
    <div className={classes.pro} key={id}>
      <div className={classes.image_box}>
        <img src={image} alt="hero-carousel-image" />
      </div>
    </div>
  );
});

export default HeroCarouselItem;
