import { memo } from "react";
import { Link } from "react-router-dom";

import classes from "./GymItem.module.css";
import "../../GlobalStyles.css";

const GymItem = ({ gym }) => {
  const { id, main_image, name } = gym;

  return (
    <div className={classes.pro}>
      <Link to={`/gyms/${id}`} className="link-decoration-remover">
        <div className={classes.gym_info_box}>
          <div className={classes.image_box}>
            <img src={main_image} alt="" />
          </div>

          <div className={classes.info}>
            <h4>{name}</h4>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default memo(GymItem);
