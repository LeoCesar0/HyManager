import { ReactNode } from "@/@types";
import { BankAccount } from "@/server/models/BankAccount/schema";
import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import { useGlobalAuth } from "./GlobalAuth";
import { listBankAccountByUserId } from "@/server/models/BankAccount/read/listBankAccountByUserId";
import { useRouter } from "next/navigation";
import { DateBreakPoint } from "@/server/utils/calculateDashboardSummary";
import { getDateBreakPoints } from "@/pageComponents/Dashboard/Overview/utils/getDateBreakPoints";

export type DashboardOverviewConfig = {
  dateBreakPoints: DateBreakPoint[];
  earliestBreakPoint: DateBreakPoint;
};

interface IState {
  menuIsOpen: boolean;
  currentBankAccount: BankAccount | null;
  bankAccounts: BankAccount[];
  overviewConfig: DashboardOverviewConfig;
}

interface IActions {
  toggleMenu: () => void;
  setCurrentBankAccount: (bank: BankAccount | null) => void;
  setState: Dispatch<SetStateAction<IState>>;
  fetchBankAccounts: (data?: BankAccount[]) => Promise<void>;
}

interface IGlobalDashboardStore extends IState, IActions {}

const overviewConfigInit = getDateBreakPoints();
const initialValues: IState = {
  menuIsOpen: true,
  currentBankAccount: null,
  bankAccounts: [],
  overviewConfig: {
    dateBreakPoints: overviewConfigInit.breakPoints,
    earliestBreakPoint: overviewConfigInit.earliestBreakPoint,
  },
};

const Context = createContext<IGlobalDashboardStore>(
  {} as IGlobalDashboardStore
);

export const GlobalDashboardStore: ReactNode = ({ children }) => {
  const [state, setState] = useState<IState>(initialValues);
  const { currentUser } = useGlobalAuth();
  const router = useRouter();

  const toggleMenu = () => {
    setState((prev) => ({ ...prev, menuIsOpen: !prev.menuIsOpen }));
  };

  const setCurrentBankAccount = (bankAccount: BankAccount | null) => {
    setState((prev) => ({ ...prev, currentBankAccount: bankAccount }));
  };

  // --------------------------
  // FETCH BANK ACCOUNTS
  // --------------------------

  const fetchBankAccounts = async (data?: BankAccount[]) => {
    if (data) {
      const current = data.find(
        (item) => item.id === state.currentBankAccount?.id
      );
      setState((prev) => ({
        ...prev,
        bankAccounts: data,
        currentBankAccount: current ?? null,
      }));
      return;
    }

    const id = currentUser?.id;
    if (!id) return;
    await listBankAccountByUserId({ id: id }).then((data) => {
      const list = data.data || [];
      const current = list.find(
        (item) => item.id === state.currentBankAccount?.id
      );
      setState((prev) => ({
        ...prev,
        bankAccounts: list,
        currentBankAccount: current ?? list[0] ?? null,
      }));

      const shouldCreateBankAccount = !list || list.length > 0;

      if (!shouldCreateBankAccount) {
        router.push("/dashboard/createBankAccount");
      }

      return data;
    });
  };

  useEffect(() => {
    if (currentUser?.id) {
      fetchBankAccounts();
    }
  }, [currentUser?.id]);
  // --------------------------

  useEffect(() => {
    const { breakPoints, earliestBreakPoint } = getDateBreakPoints();
    setState((prev) => ({
      ...prev,
      overviewConfig: {
        dateBreakPoints: breakPoints,
        earliestBreakPoint,
      },
    }));
  }, []);

  return (
    <Context.Provider
      value={{
        ...state,
        toggleMenu,
        setState,
        setCurrentBankAccount,
        fetchBankAccounts,
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
