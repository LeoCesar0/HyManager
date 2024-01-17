import { ReactNode } from "@/@types";
import { BankAccount } from "@/server/models/BankAccount/schema";
import { createContext, Dispatch, SetStateAction, useContext, useState } from "react";

interface IState {
  menuIsOpen: boolean;
  currentBankAccount: BankAccount | null;
  shouldCreateBankAccount: boolean
}

interface IActions {
  toggleMenu: () => void;
  setCurrentBankAccount: (bank: BankAccount | null) => void;
  setState: Dispatch<SetStateAction<IState>>;
}

interface IGlobalDashboardStore extends IState, IActions {}

const initialValues: IState = {
  menuIsOpen: true,
  currentBankAccount: null,
  shouldCreateBankAccount: false,
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
        setState,
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
