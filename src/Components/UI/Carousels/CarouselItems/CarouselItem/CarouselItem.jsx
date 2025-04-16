import React, { memo } from "react";
import { Link } from "react-router-dom";

import classes from "./CarouselItem.module.css";
import "../../../../../GlobalStyles.css";

const CarouselItem = memo((props) => {
  const { id, image, name, link } = props;

  return (
    <div className={classes.pro}>
      {link ? (
        <Link to={link} className="link-decoration-remover">
          <div className={classes.gym_info_box}>
            <div className={classes.image_box}>
              <img src={image} alt="" />
            </div>

            <div className={classes.info}>
              <h4 style={{ marginTop: "1rem" }}>{name}</h4>
            </div>
          </div>
        </Link>
      ) : (
        <div className={classes.gym_info_box}>
          <div className={classes.image_box}>
            <img src={image} alt="" />
          </div>

          <div className={classes.info}>
            <h4>{name}</h4>
          </div>
        </div>
      )}
    </div>
  );
});

export default CarouselItem;
