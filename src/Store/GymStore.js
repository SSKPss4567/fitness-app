import { makeAutoObservable, runInAction, reaction, toJS } from "mobx";

import gyms from "../mock/Gyms";
class GymStore {
  gyms = [];

  loading = true;

  constructor() {
    makeAutoObservable(this);
    this.initializeSession();
  }

  initializeSession = () => {
    runInAction(() => {
      this.gyms = gyms;
    });
  };

  getGym = (gym_id) => {
    const reposnse_gym = getTrainer(gym_id);
    console.log("fetched trainer: ", reposnse_gym);

    return gyms.find((gym) => gym.id === gym_id);
  };
}

export const gymStore = new GymStore();
