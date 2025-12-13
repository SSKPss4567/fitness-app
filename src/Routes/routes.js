import {
  MAIN_ROUTE,
  ERROR_ROUTE,
  SIGNIN_ROUTE,
  SIGNUP_ROUTE,
  FAQ_ROUTE,
  ABOUT_ROUTE,
  ADMIN_ROUTE,
  USER_PROFILE_ROUTE,
  TRAINERS_ROUTE,
  SUPPORT_ROUTE,
  GYMS_ROUTE,
  CONFIRM_ROUTE,
  PAYMENT_ROUTE,
  PAYMENT_SUCCESS_ROUTE,
} from "../Utils/consts";

import MainPage from "../Pages/MainPage";
import { Profile } from "../Pages/Profile";
import AllTrainersPage from "../Pages/AllTrainersPage";
import TrainerPage from "../Pages/Trainer";
import AllGymsPage from "../Pages/AllGymsPage";
import GymPage from "../Pages/GymPage";
import { FAQ } from "../Pages/FAQ";
import Support from "../Pages/Support";
import SignInPage from "../Pages/SignInPage";
import SignUpPage from "../Pages/SignUpPage";
import ConfirmPage from "../Pages/ConfirmPage";
import PaymentPage from "../Pages/PaymentPage";
import PaymentSuccess from "../Pages/PaymentSuccess";

export const publicRoutes = [
  {
    path: MAIN_ROUTE,
    Component: MainPage,
  },
  {
    path: FAQ_ROUTE,
    Component: FAQ,
  },
  {
    path: SUPPORT_ROUTE,
    Component: Support,
  },
  {
    path: TRAINERS_ROUTE,
    Component: AllTrainersPage,
  },
  {
    path: TRAINERS_ROUTE + "/:trainerID",
    Component: TrainerPage,
  },
  {
    path: GYMS_ROUTE,
    Component: AllGymsPage,
  },
  {
    path: GYMS_ROUTE + "/:gymID",
    Component: GymPage,
  },
  {
    path: SIGNUP_ROUTE,
    Component: SignUpPage,
  },
  {
    path: SIGNIN_ROUTE,
    Component: SignInPage,
  },
  {
    path: CONFIRM_ROUTE,
    Component: ConfirmPage,
  },
  {
    path: PAYMENT_ROUTE,
    Component: PaymentPage,
  },
  {
    path: PAYMENT_SUCCESS_ROUTE,
    Component: PaymentSuccess,
  },
];

export const authRoutes = [
  {
    path: USER_PROFILE_ROUTE + "/:userId",
    Component: Profile,
  },
];

export const adminRoutes = [];
