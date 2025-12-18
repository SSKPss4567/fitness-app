import classes from "./Navbar.module.css";
import "../../GlobalStyles.css";
import { Link } from "react-router-dom";

import { observer } from "mobx-react";
import { useStores } from "../../Store/StoreProvider";

import TextButton from "../UI/Buttons/TextButton/TextButton";
// UI

export default observer(function Navbar() {
  const { userStore } = useStores();

  const { user, userRole } = userStore;

  return (
    <nav className={classes.navbar}>
      <Link to="/" className={classes.logo}>
        <img
          style={{ width: "40px", height: "40px" }}
          src={"/static/gym.png"}
          alt="Логотип спортзала"
        />
        <h2>FIT FIND</h2>
      </Link>

      <ul className={classes.nav_links}>
        <li>
          <Link to="/gyms" className={"link-decoration-remover"}>
            <TextButton>
              <p style={{ fontWeight: "bold" }}>ЗАЛЫ</p>
            </TextButton>
          </Link>
        </li>
        <li>
          <Link to="/trainers" className={"link-decoration-remover"}>
            <TextButton>
              <p style={{ fontWeight: "bold" }}>ТРЕНЕРЫ</p>
            </TextButton>
          </Link>
        </li>
        {userRole ? (
          <li>
            <Link
              to={`/profile/${user.id}`}
              className={"link-decoration-remover"}
            >
              <TextButton>
                <p style={{ fontWeight: "bold" }}>ПРОФИЛЬ</p>
              </TextButton>
            </Link>
          </li>
        ) : (
          <li>
            <Link to="/signup" className={"link-decoration-remover"}>
              <TextButton>
                <p style={{ fontWeight: "bold" }}>РЕГИСТРАЦИЯ</p>
              </TextButton>
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
});
