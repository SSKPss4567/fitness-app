import React, { createContext, useContext } from 'react';
import { userStore } from './UserStore';
import { dataStore } from './DataStore';
import { gymStore } from './GymStore';
import { adminStore } from './AdminStore';

const StoreContext = createContext({
  userStore,
  dataStore,
  adminStore,
  gymStore,
});

export const StoreProvider = ({ children }) => {
  return (
    <StoreContext.Provider value={{ userStore, dataStore, adminStore, gymStore}}>
      {children}
    </StoreContext.Provider>
  );
};


export const useStores = () => useContext(StoreContext);
