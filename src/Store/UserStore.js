import { makeAutoObservable, toJS, runInAction } from "mobx";
// import { newAccessToken, getUserInfo, updateUserInfo, logout, getUserOrders, getOneUserOrder } from '../http/userAPI';

import { isBefore } from "date-fns";
import users from "../mock/User";
class UserStore {
  user = {};
  confirmedSlots = [];
  finishedTrainings = [];
  bookedSlots = [];
  userOrder = {};
  auth = "";
  isLoggedIn = false;
  isLoading = false;
  isSessionInitialized = false;

  get userRole() {
    console.log("ROLE: ", this.user.role);
    return this.user.role;
  }

  constructor() {
    makeAutoObservable(this);
    this.initializeSession();
  }

  setUser = (userData) => {
    this.user = userData;
    this.isLoggedIn = true;
  };

  addBookedSlots = (slot, trainerId) => {
    if (isBefore(slot, Date.now())) {
      return -1;
    }

    const foundTrainerIndex = this.bookedSlots.findIndex(
      (slot) => slot.trainerId === trainerId
    );

    runInAction(() => {
      if (foundTrainerIndex !== -1) {
        const trainerBookedSlots =
          this.bookedSlots[foundTrainerIndex].timeSlots;
        if (!trainerBookedSlots.includes(slot)) {
          trainerBookedSlots.push(slot);
        }
      } else {
        this.bookedSlots.push({
          trainerId: trainerId,
          timeSlots: [slot],
        });
      }
    });

    localStorage.setItem("bookedSlots", JSON.stringify(toJS(this.bookedSlots)));
    console.log("BOOKED: ", toJS(this.bookedSlots));
  };

  removeBookedSlots = (slots, trainerId) => {
    const foundTrainerIndex = this.bookedSlots.findIndex(
      (slot) => slot.trainerId === trainerId
    );

    console.log(slots, trainerId, foundTrainerIndex);

    runInAction(() => {
      if (foundTrainerIndex !== -1) {
        const trainerBookedSlots =
          this.bookedSlots[foundTrainerIndex].timeSlots;
        this.bookedSlots[foundTrainerIndex].timeSlots =
          trainerBookedSlots.filter((slot) => !slots.includes(slot));

        if (this.bookedSlots[foundTrainerIndex].timeSlots.length === 0) {
          this.bookedSlots.splice(foundTrainerIndex, 1);
        }
      }
    });

    // Save updated bookedSlots to localStorage
    localStorage.setItem("bookedSlots", JSON.stringify(toJS(this.bookedSlots)));
    console.log("UPDATED BOOKED: ", toJS(this.bookedSlots));
  };

  // signIn = (email, pwd) => {
  //     console.log('EMAIL, PWD: ', email, pwd);
  //     const check = users.find((user) => user.email === email && user.password === pwd);

  //     console.log('CHECK: ', check);
  //     if (check) {
  //         console.log('CORRECT PWD AND EMAIL');
  //         runInAction(() => {
  //             this.setUser(check);

  //             if (Array.isArray(this.user.bookedSlots)) {
  //                 let finishedTrainings = [];
  //                 let confirmedSlots = [];

  //                 this.user.bookedSlots.forEach(({ trainerId, timeSlots }) => {
  //                     const pastSlots = timeSlots.filter(timeSlot => isBefore(new Date(timeSlot), new Date()));
  //                     const futureSlots = timeSlots.filter(timeSlot => !isBefore(new Date(timeSlot), new Date()));

  //                     if (futureSlots.length > 0) {
  //                         confirmedSlots.push({ trainerId, timeSlots: futureSlots });
  //                     }
  //                     if (pastSlots.length > 0) {
  //                         finishedTrainings.push({ trainerId, timeSlots: pastSlots });
  //                     }
  //                 });

  //                 this.finishedTrainings = this.user.finishedTrainings, finishedTrainings;
  //                 this.confirmedSlots = confirmedSlots;

  //                 localStorage.setItem('finishedTrainings', JSON.stringify(toJS(this.finishedTrainings)));
  //                 localStorage.setItem('confirmedSlots', JSON.stringify(toJS(this.confirmedSlots)));
  //             }

  //             localStorage.setItem('user', JSON.stringify(this.user));
  //         });
  //         console.log(toJS(this.user));
  //     }
  // };
  signIn = (email, pwd) => {
    console.log("EMAIL, PWD:", email, pwd);
    const user = users.find((u) => u.email === email && u.password === pwd);

    console.log("USER FOUND:", user);
    if (!user) {
      console.log("INVALID EMAIL OR PASSWORD");
      return;
    }

    console.log("LOGIN SUCCESSFUL");
    runInAction(() => {
      this.setUser(user);

      if (Array.isArray(user.slots)) {
        const finishedTrainings = [];
        const confirmedSlots = [];

        user.slots.forEach(({ trainingId, trainerId, timeSlot, status }) => {
          const slotDate = new Date(timeSlot);
          const isPast = isBefore(slotDate, new Date());

          if (status === "confirmed" && !isPast) {
            confirmedSlots.push({ trainingId, trainerId, timeSlot });
          } else if (status === "finished" || isPast) {
            finishedTrainings.push({ trainingId, trainerId, timeSlot });
          }
        });

        this.finishedTrainings = finishedTrainings;
        this.confirmedSlots = confirmedSlots;

        localStorage.setItem(
          "finishedTrainings",
          JSON.stringify(toJS(this.finishedTrainings))
        );
        localStorage.setItem(
          "confirmedSlots",
          JSON.stringify(toJS(this.confirmedSlots))
        );
      }

      localStorage.setItem("user", JSON.stringify(this.user));
    });

    console.log(toJS(this.user));
  };

  signOut = () => {
    runInAction(() => {
      this.user = {};
      this.confirmedSlots = [];
      this.isLoggedIn = false;
      localStorage.removeItem("user");
      localStorage.removeItem("confirmedSlots");
    });
  };

  async initializeSession() {
    const user_storage = localStorage.getItem("user");
    const confirmedSlotsStorage = localStorage.getItem("confirmedSlots") || "";
    
    // Если пользователь не в localStorage, автоматически логиним первого пользователя
    if (!user_storage) {
      const defaultUser = users.find(u => u.role === "user");
      if (defaultUser) {
        runInAction(() => {
          this.setUser(defaultUser);
          
          if (Array.isArray(defaultUser.slots)) {
            const finishedTrainings = [];
            const confirmedSlots = [];

            defaultUser.slots.forEach(({ trainingId, trainerId, timeSlot, status }) => {
              const slotDate = new Date(timeSlot);
              const isPast = isBefore(slotDate, new Date());

              if (status === "confirmed" && !isPast) {
                confirmedSlots.push({ trainingId, trainerId, timeSlot });
              } else if (status === "finished" || isPast) {
                finishedTrainings.push({ trainingId, trainerId, timeSlot });
              }
            });

            this.finishedTrainings = finishedTrainings;
            this.confirmedSlots = confirmedSlots;

            localStorage.setItem(
              "finishedTrainings",
              JSON.stringify(toJS(this.finishedTrainings))
            );
            localStorage.setItem(
              "confirmedSlots",
              JSON.stringify(toJS(this.confirmedSlots))
            );
          }

          localStorage.setItem("user", JSON.stringify(this.user));
        });
      }
    } else {
      runInAction(() => {
        this.setUser(JSON.parse(user_storage));
        this.confirmedSlots =
          confirmedSlotsStorage && JSON.parse(confirmedSlotsStorage);
      });
    }

    const finishedTrainingsStorage =
      localStorage.getItem("finishedTrainings") || "";
    if (finishedTrainingsStorage.length > 0) {
      runInAction(() => {
        this.finishedTrainings = JSON.parse(finishedTrainingsStorage);
      });
    }

    const bookedSlotsStorage = localStorage.getItem("bookedSlots");
    if (bookedSlotsStorage) {
      const parsedSlots = JSON.parse(bookedSlotsStorage);

      const filteredBookings = parsedSlots
        .map(({ trainerId, timeSlots }) => ({
          trainerId,
          timeSlots: timeSlots.filter(
            (slot) => !isBefore(new Date(slot), new Date())
          ),
        }))
        .filter(({ timeSlots }) => timeSlots.length > 0);

      console.log(filteredBookings);
      runInAction(() => {
        this.bookedSlots = filteredBookings;
      });
    }

    runInAction(() => {
      this.isSessionInitialized = true;
    });

    console.log(toJS(this.user));
  }

  fetchUserData = async () => {
    try {
      const userData = await getUserInfo();
      if (userData) {
        runInAction(() => {
          this.setUser(userData);
        });
      }
    } catch (err) {
      console.error("Failed to fetch user data:", err);
    }
  };

  updateUserInfo = async (updatedData) => {
    try {
      const response = await updateUserInfo(updatedData, this.user.user_id);
      if (response) {
        runInAction(() => {
          this.user = { ...this.user, ...updatedData };
        });
      }
    } catch (err) {
      console.error("Failed to update user info:", err);
    }
  };

  logoutUser = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Failed to log out from server:", error);
    } finally {
      runInAction(() => {
        this.user = {};
        this.auth = "";
        this.userOrders = [];
        this.isLoggedIn = false;
      });

      console.log("USER: ", toJS(this.user));
    }
  };
}

export const userStore = new UserStore();
