import { makeAutoObservable, runInAction } from "mobx";

class DataStore {
    cities = [];
    pickpoints = {};
    isLoadingCities = true;
    isLoadingPickpoints = false;

    constructor() {
        makeAutoObservable(this);
    }
   
}

export const dataStore = new DataStore();
