import React from 'react'
import { Link } from 'react-router-dom';

import classes from './TrainerItem.module.css'

const TrainerItem = ({trainer}) => {
  const {
    id,
    image,
    full_name,
    name,
    specialization,
    rating,
    reviews_count,
    gyms
  } = trainer;

  const displayName = full_name || name;

  const toTop = () => {
    window.scrollTo({
      left: 0,
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <div className={classes.pro}>
      <Link to={`/trainers/${id}`} className='link-decoration-remover' onClick={toTop}>
        <div className={classes.trainer_info_box}>
          <div className={classes.image_box}>
            {image ? (
              <img src={image} alt={displayName} />
            ) : (
              <div style={{ width: '100%', height: '100%', background: '#ddd', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span>Нет фото</span>
              </div>
            )}
          </div>

          <div className={classes.info}>
            <h2>{displayName}</h2>
            <h4>{specialization}</h4>
            {rating > 0 && (
              <p style={{ fontSize: '0.9rem' }}>⭐ {rating.toFixed(1)} ({reviews_count} отзывов)</p>
            )}
            {gyms && gyms.length > 0 && (
              <div className={classes.specialties_box}>
                <p style={{ fontSize: '0.85rem', color: '#666' }}>
                  Залы: {gyms.map(g => g.name).join(', ')}
                </p>
              </div>
            )}
          </div>
        </div>
      </Link>
    </div>
  )
}

export default TrainerItem