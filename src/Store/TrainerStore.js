import { runInAction, toJS, makeAutoObservable } from "mobx";
import trainers from "../mock/Trainers";

import { getTrainer } from "../http/dataApi";

class TrainerStore {
  trainers = [];
  trainer_schedule = [];
  isLoading = false;

  constructor() {
    makeAutoObservable(this);
    this.initializeSession();
  }

  initializeSession = () => {
    runInAction(() => {
      this.trainers = trainers;
    });
  };

  getTrainer = (trainer_id) => {
    const reposnse_trainer = getTrainer(trainer_id);
    console.log("fetched trainer: ", reposnse_trainer);

    return trainers.find((trainer) => trainer.id === trainer_id);
  };
}
