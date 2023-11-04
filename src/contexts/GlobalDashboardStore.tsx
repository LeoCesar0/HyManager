import { ReactNode } from "@/@types";
import { BankAccount } from "@/server/models/BankAccount/schema";
import { createContext, useContext, useState } from "react";

interface IState {
  menuIsOpen: boolean;
  currentBankAccount: BankAccount | null;
}

interface IActions {
  toggleMenu: () => void;
  setCurrentBankAccount: (bank: BankAccount | null) => void;
}

interface IGlobalDashboardStore extends IState, IActions {}

const initialValues: IState = {
  menuIsOpen: true,
  currentBankAccount: null,
};

const Context = createContext<IGlobalDashboardStore>(
  {} as IGlobalDashboardStore
);

export const GlobalDashboardStore: ReactNode = ({ children }) => {
  const [state, setState] = useState<IState>(initialValues);

  const toggleMenu = () => {
    setState((prev) => ({ ...prev, menuIsOpen: !prev.menuIsOpen }));
  };

  const setCurrentBankAccount = (bankAccount: BankAccount | null) => {
    setState((prev) => ({ ...prev, currentBankAccount: bankAccount }));
  };

  return (
    <Context.Provider
      value={{
        ...state,
        toggleMenu,
        setCurrentBankAccount,
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
