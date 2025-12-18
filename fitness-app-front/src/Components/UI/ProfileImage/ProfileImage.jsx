import { memo } from "react";
import classes from "./ProfileImage.module.css";
import trainerBaseImg from "../../../assets/trainer_base.jpg";

const ProfileImage = ({ name = "", img, useDefaultImage = false }) => {
  const nameParts = name.trim().split(" ");
  const initials =
    nameParts.length > 1
      ? `${nameParts[0][0]}${nameParts[1][0]}`
      : nameParts[0]?.[0] || "?";

  // Если useDefaultImage = true и нет img, используем дефолтное изображение
  const displayImage = img || (useDefaultImage ? trainerBaseImg : null);

  return (
    <div className={classes.profileContainer}>
      {displayImage ? (
        <img src={displayImage} alt="Profile" className={classes.profileImage} />
      ) : (
        <span className={classes.profileInitials}>{initials}</span>
      )}
    </div>
  );
};

export default memo(ProfileImage);
