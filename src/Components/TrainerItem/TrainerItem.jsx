import React from 'react'
import { Link } from 'react-router-dom';

import classes from './TrainerItem.module.css'

const TrainerItem = ({trainer}) => {
  const {
    id,
    image,
    name,
    specialties,
    pricePerHour,
  } = trainer;

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
            <img src={image} alt="" />
          </div>

          <div className={classes.info}>
            <h2>{name}</h2>
            <h4>Price per hour: {pricePerHour}</h4>
            <p>Specialties: </p>
            <div className={classes.specialties_box}>
              {specialties.map((specialty) => {
                return <p>{specialty}</p>
              })}
            </div>
          </div>
        </div>
      </Link>
    </div>
  )
}

export default TrainerItem