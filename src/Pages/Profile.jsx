import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { observer } from "mobx-react";
import { useStores } from "../Store/StoreProvider";

import ProfileDisplay from "../Components/ProfileDisplay/ProfileDisplay";

export const Profile = observer(() => {
  const { userStore } = useStores();
  const { userRole } = userStore;

  const navigate = useNavigate();

  useEffect(() => {
    if (!userRole || userRole !== "user") {
      navigate("/");
    }
  }, [userRole, navigate]);

  if (!userRole || userRole !== "user") return null;

  return <ProfileDisplay />;
});

export default Profile;
