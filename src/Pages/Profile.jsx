import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { observer } from "mobx-react";
import { useStores } from "../Store/StoreProvider";

import ProfileDisplay from "../Components/ProfileDisplay/ProfileDisplay";
import TrainerProfileDisplay from "../Components/TrainerProfileDisplay/TrainerProfileDisplay";

export const Profile = observer(() => {
  const { userStore } = useStores();
  const { userRole } = userStore;

  const navigate = useNavigate();

  useEffect(() => {
    if (!userRole) {
      navigate("/");
    }
  }, [userRole, navigate]);

  if (!userRole) return null;

  switch (userRole) {
    case "user":
      return <ProfileDisplay />;
    case "trainer":
      return <TrainerProfileDisplay />;
    //     case "admin":
    // return <TrainerProfileDisplay />;
    default:
      return null;
  }
});

export default Profile;
