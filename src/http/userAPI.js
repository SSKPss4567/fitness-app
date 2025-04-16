import { api } from "./index";

// let csrfToken = "";

// const getCsrfToken = async () => {
//   try {
//     const response = await api.get("/csrf-token");
//     csrfToken = response.data.csrfToken;
//   } catch (error) {
//     console.error("Ошибка получения CSRF токена:", error);
//   }
// };

// getCsrfToken();

export const registration = async (user_info) => {
  try {
    const response = await api.post("/register", user_info, {
      headers: {
        "Content-Type": "application/json",
        // "X-CSRF-Token": csrfToken,
      },
    });

    console.log("Успешная регистрация:", response.data);
    return response.data;
  } catch (error) {
    console.error("Ошибка регистрации:", error);
    throw error;
  }
};

export const login = async (email, pwd) => {
  try {
    const response = await api.post(
      "/login",
      { email, pwd },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Response: ", response.data);
    return response.data;
  } catch (error) {
    console.error("Ошибка входа:", error);
    throw error;
  }
};

//export const logout = async (user_id) => {
//try {
//    const response = await api.post(
//      "/logout",
//      { user_id },
//      {
//        headers: {
//          "Content-Type": "application/json",
//          // "X-CSRF-Token": csrfToken,
//        },
//      }
//    );
//
//    return response.data;
//  } catch (error) {
//    console.error("Logout failed:", error);
//  }
//};

export const logout = async (user_id) => {
  try {
    const response = await api.get("/logout", {
      params: { user_id }, 
      headers: {
        "Content-Type": "application/json",
        // "X-CSRF-Token": csrfToken,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Logout failed:", error);
  }
};

export const changeUserInfo = async (user_info) => {
  try {
    const response = await api.post(`/update_user/${user_info.id}`, user_info, {
      headers: {
        "Content-Type": "application/json",
        // "X-CSRF-Token": csrfToken,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error while updating user info:", error);
  }
};

export const confirmSlot = async (slot_info) => {
  try {
    const response = await api.post("/confirm", slot_info, {
      headers: {
        "Content-Type": "application/json",
        // "X-CSRF-Token": csrfToken,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error while confirming slot", error);
  }
};

export const cancelSlot = async (slot_id) => {
  try {
    const response = await api.post(
      "/cancel",
      { slot_id },
      {
        headers: {
          "Content-Type": "application/json",
          // "X-CSRF-Token": csrfToken,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error while canceling slot", error);
  }
};

export const getDaySlots = async (user_id, date) => {
  try {
    const response = await api.get("/get_day_slots", {
      headers: {
        "Content-Type": "application/json",
        // "X-CSRF-Token": csrfToken,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error while fetching slots for this day", error);
  }
};

//export const submitReview = async (review, review_item, item_id) => {
//  try {
//    const response = await api.get(
//      `/${review_item}/submit_review/${item_id}`,
//      {//
//        user_id,
//        review,
//      },
//      {
//        headers: {
//          "Content-Type": "application/json",
//          // "X-CSRF-Token": csrfToken,
//        },
//      }
//    );
//
//    return response.data;
//  } catch (error) {
//    console.error("Error while fetching slots for this day", error);
//  }
//};
export const submitReview = async (review, review_item, item_id, u_timetable_id, data, rank) => {
  try {
    const response = await api.post(
      `/${review_item}/submit_review/${item_id}`,
      {
        u_timetable_id,
        data,
        rank,
        review,
      },
      {
        headers: {
          "Content-Type": "application/json",
          // "X-CSRF-Token": csrfToken,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error while submitting review", error);
  }
};