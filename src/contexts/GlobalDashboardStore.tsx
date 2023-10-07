import { ReactNode } from "@/@types";
import { createContext, useContext, useState } from "react";

interface IGlobalDashboardStore {
  menuIsOpen: boolean;
  toggleMenu: () => void;
}

const initialValues = {
  menuIsOpen: true,
};

const Context = createContext<IGlobalDashboardStore>(
  initialValues as IGlobalDashboardStore
);

export const GlobalDashboardStore: ReactNode = ({ children }) => {
  const [state, setState] = useState(initialValues);

  const toggleMenu = () => {
    setState((prev) => ({ ...prev, menuIsOpen: !prev.menuIsOpen }));
  };

  return (
    <Context.Provider
      value={{
        ...state,
        toggleMenu,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export const useGlobalDashboardStore = () => {
  const state = useContext(Context);
  return state;
};
