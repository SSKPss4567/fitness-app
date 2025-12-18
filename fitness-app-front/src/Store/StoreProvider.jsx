import { createContext, useContext } from 'react';
import { userStore } from './UserStore';

const StoreContext = createContext({
  userStore,
});

export const StoreProvider = ({ children }) => {
  return (
    <StoreContext.Provider value={{ userStore }}>
      {children}
    </StoreContext.Provider>
  );
};


export const useStores = () => useContext(StoreContext);
