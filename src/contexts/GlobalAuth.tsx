import { debounce } from "lodash";
import { useRouter } from "next/router";
import React, {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import { getUserById } from "src/models/User/read";
import { getUserBankAccounts } from "../models/BankAccount/query";
import { firebaseAuth, signIn, signOut } from "../services/firebase";
import { CurrentUser } from "../types/models/AppUser";
import { BankAccount } from "../types/models/BankAccount";
import { showErrorToast } from "../utils/app";

interface GlobalAuthProps {
  currentUser: CurrentUser | null;
  menuIsOpen: boolean;
  setState: Dispatch<SetStateAction<GlobalAuthProps>>;
  handleSignIn: () => void;
  handleSignOut: () => void;
  handleGetUserBankAccounts: () => void;
  loading: boolean;
  userBankAccounts: BankAccount[] | null;
}

const initialValues = {
  currentUser: null,
  menuIsOpen: false,
  loading: false,
  userBankAccounts: null,
};
const GlobalAuth = createContext<GlobalAuthProps>(
  initialValues as GlobalAuthProps
);

const handleGetUserById = (
  uid: string,
  setState: Dispatch<SetStateAction<GlobalAuthProps>>
) => {
  setState((prev) => ({ ...prev, loading: true }));
  getUserById({
    id: uid,
  })
    .then((foundUserResponse) => {
      setState((prev) => ({
        ...prev,
        currentUser: foundUserResponse.data,
      }));
    })
    .catch((err) => {
      setState((prev) => ({ ...prev, currentUser: null }));
    })
    .finally(() => {
      setState((prev) => ({ ...prev, loading: false }));
    });
};

/* -------------------------------- PROVIDER -------------------------------- */

export const GlobalAuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, setState] = useState<GlobalAuthProps>(
    initialValues as GlobalAuthProps
  );
  const router = useRouter();

  const { currentUser, loading } = state;

  /* --------------------------- onAuthStateChanged --------------------------- */
  firebaseAuth.onAuthStateChanged((user) => {
    // RETURN WHEN NOTHING WOULD CHANGE
    if (!user && !currentUser) return;
    if (user && user.uid === currentUser?.uid) return;

    if (!user) {
      setState((prev) => ({ ...prev, currentUser: null, loading: false }));
      return;
    }
    if (!loading && user && user.uid !== currentUser?.uid) {
      handleGetUserById(user.uid, setState);
    }
  });

  /* ------------------------------ handleSignOut ----------------------------- */
  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };
  /* ------------------------------ handleSignIn ------------------------------ */
  const handleSignIn = async () => {
    setState((prev) => ({ ...prev, loading: true }));
    const { data, error } = await signIn();

    if (error) showErrorToast(error);

    setState((prev) => ({
      ...prev,
      currentUser: data,
      loading: false,
    }));
  };

  /* ---------------------------------- USER ---------------------------------- */
  const handleGetUserBankAccounts = () => {
    if (currentUser) {
      setState((prev) => ({
        ...prev,
        loading: true,
      }));
      getUserBankAccounts({
        uid: currentUser.uid,
      }).then((results) => {
        setState((prev) => ({
          ...prev,
          userBankAccounts: results.data || [],
          loading: false,
        }));
      });
    } else {
      setState((prev) => ({
        ...prev,
        userBankAccounts: null,
        loading: false,
      }));
    }
  };

  useEffect(() => {
    handleGetUserBankAccounts();
  }, [currentUser?.uid]);

  return (
    <GlobalAuth.Provider
      value={{
        ...state,
        setState,
        handleSignOut,
        handleSignIn,
        handleGetUserBankAccounts,
      }}
    >
      {children}
    </GlobalAuth.Provider>
  );
};

export const useGlobalAuth = () => {
  const context = useContext(GlobalAuth);

  return context;
};
