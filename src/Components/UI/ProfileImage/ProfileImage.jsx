import { memo } from "react";
import classes from "./ProfileImage.module.css";

const ProfileImage = ({ name = "", img }) => {
  const nameParts = name.trim().split(" ");
  const initials =
    nameParts.length > 1
      ? `${nameParts[0][0]}${nameParts[1][0]}`
      : nameParts[0]?.[0] || "?";

  return (
    <div className={classes.profileContainer}>
      {img ? (
        <img src={img} alt="Profile" className={classes.profileImage} />
      ) : (
        <span className={classes.profileInitials}>{initials}</span>
      )}
    </div>
  );
};

export default memo(ProfileImage);
