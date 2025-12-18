import { memo } from "react";
import { Link } from "react-router-dom";

import classes from "./GymItem.module.css";
import "../../GlobalStyles.css";

const GymItem = ({ gym }) => {
  const { id, main_image, name, address, rating, trainers_count } = gym;

  return (
    <div className={classes.pro}>
      <Link to={`/gyms/${id}`} className="link-decoration-remover">
        <div className={classes.gym_info_box}>
          <div className={classes.image_box}>
            {main_image ? (
              <img src={main_image} alt={name} />
            ) : (
              <div style={{ width: '100%', height: '100%', background: '#ddd', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span>Нет фото</span>
              </div>
            )}
          </div>

          <div className={classes.info}>
            <h4>{name}</h4>
            {address && <p style={{ fontSize: '0.9rem', color: '#666' }}>{address}</p>}
            {rating > 0 && <p style={{ fontSize: '0.85rem' }}>⭐ {rating.toFixed(1)}</p>}
            {trainers_count > 0 && <p style={{ fontSize: '0.85rem' }}>Тренеров: {trainers_count}</p>}
          </div>
        </div>
      </Link>
    </div>
  );
};

export default memo(GymItem);
