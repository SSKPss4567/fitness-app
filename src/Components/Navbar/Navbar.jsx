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
          src={"/gym.png"}
          alt="Логотип спортзала"
        />
        <h2>FIT FIND</h2>
      </Link>

      <ul className={classes.nav_links}>
        <li>
          <Link to="/gyms" className={"link-decoration-remover"}>
            {/* <p>GYM</p> */}
            <TextButton>
              <p style={{ fontWeight: "bold" }}>GYM</p>
            </TextButton>
          </Link>
        </li>
        <li>
          <Link to="/trainers" className={"link-decoration-remover"}>
            <TextButton>
              <p style={{ fontWeight: "bold" }}>TRAINERS</p>
            </TextButton>
            {/* <p>TRAINERS</p> */}
          </Link>
        </li>
        {userRole ? (
          <li>
            <Link
              to={`/profile/${user.id}`}
              className={"link-decoration-remover"}
            >
              <TextButton>
                <p style={{ fontWeight: "bold" }}>PROFILE</p>
              </TextButton>
            </Link>
          </li>
        ) : (
          <li>
            <Link to="/signup" className={"link-decoration-remover"}>
              {/* <p>SIGN UP</p> */}
              <TextButton>
                <p style={{ fontWeight: "bold" }}>SIGN UP</p>
              </TextButton>
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
});
