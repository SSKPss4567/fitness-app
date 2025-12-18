import { makeAutoObservable, toJS, runInAction } from "mobx";
import { fetchCurrentUser, logoutUser } from "../http/dataApi";

import { isBefore } from "date-fns";
class UserStore {
  user = {};
  confirmedSlots = [];
  finishedTrainings = [];
  bookedSlots = [];
  isLoggedIn = false;
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

  clearTrainerBookedSlots = (trainerId) => {
    const foundTrainerIndex = this.bookedSlots.findIndex(
      (slot) => slot.trainerId === trainerId
    );

    runInAction(() => {
      if (foundTrainerIndex !== -1) {
        this.bookedSlots.splice(foundTrainerIndex, 1);
      }
    });

    // Save updated bookedSlots to localStorage
    localStorage.setItem("bookedSlots", JSON.stringify(toJS(this.bookedSlots)));
    console.log("CLEARED TRAINER SLOTS: ", trainerId);
  };


  signOut = async () => {
    try {
      // Вызываем API для выхода на сервере
      await logoutUser();
    } catch (error) {
      console.error("Ошибка при выходе:", error);
    } finally {
      // Очищаем локальное состояние в любом случае
      runInAction(() => {
        this.user = {};
        this.confirmedSlots = [];
        this.bookedSlots = [];
        this.isLoggedIn = false;
        localStorage.removeItem("user");
        localStorage.removeItem("confirmedSlots");
        localStorage.removeItem("bookedSlots");
      });
    }
  };

  async initializeSession() {
    try {
      // Проверяем авторизацию на сервере
      const response = await fetchCurrentUser();
    
      if (response.authenticated && response.user) {
        runInAction(() => {
          // Устанавливаем пользователя с role: "user" для совместимости с навигацией
          this.setUser({
            ...response.user,
            role: "user"
          });
          localStorage.setItem("user", JSON.stringify(this.user));
        });
    } else {
        // Пользователь не авторизован - очищаем localStorage
        localStorage.removeItem("user");
        runInAction(() => {
          this.user = {};
          this.isLoggedIn = false;
        });
      }
    } catch (error) {
      console.error("Ошибка при проверке авторизации:", error);
      // В случае ошибки очищаем данные
      localStorage.removeItem("user");
      runInAction(() => {
        this.user = {};
        this.isLoggedIn = false;
      });
    }
    
    const confirmedSlotsStorage = localStorage.getItem("confirmedSlots") || "";

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

}

export const userStore = new UserStore();
