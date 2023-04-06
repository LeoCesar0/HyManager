import { useRouter } from "next/router";
import React, {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import { listBankAccountByUserId } from "src/models/BankAccount/read";
import { BankAccount } from "src/models/BankAccount/schema";
import { getUserById } from "src/models/User/read";
import { User } from "src/models/User/schema";
import { firebaseAuth, signIn, signOut } from "../services/firebase";
import { showErrorToast } from "../utils/app";

interface GlobalAuthProps {
  currentUser: User | null;
  menuIsOpen: boolean;
  setState: Dispatch<SetStateAction<GlobalAuthProps>>;
  handleSignIn: () => void;
  handleSignOut: () => void;
  getUserBankAccounts: () => void;
  loading: boolean;
  userBankAccounts: BankAccount[] | null;
  error: { message: string } | null;
}

const initialValues = {
  currentUser: null,
  menuIsOpen: false,
  loading: false,
  userBankAccounts: null,
  error: null,
};
const GlobalAuth = createContext<GlobalAuthProps>(
  initialValues as GlobalAuthProps
);

const handleGetUserById = async (
  uid: string,
  setState: Dispatch<SetStateAction<GlobalAuthProps>>
) => {
  setState((prev) => ({ ...prev, loading: true }));
  const result = await getUserById({ id: uid });

  setState((prev) => ({
    ...prev,
    currentUser: result.data,
    loading: false,
    error: result.error,
  }));
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
    console.log("-- onAuthStateChanged --");
    console.log("state -->", state);
    // RETURN WHEN NOTHING WOULD CHANGE
    if (!user && !currentUser) return;
    if (user && user.uid === currentUser?.id) return;
    if (state.error) {
      console.log("Auth error -->", state.error);
      return;
    }

    if (!user) {
      setState((prev) => ({ ...prev, currentUser: null, loading: false }));
      return;
    }
    if (!loading && user && user.uid !== currentUser?.id) {
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
  const getUserBankAccounts = () => {
    if (currentUser) {
      setState((prev) => ({
        ...prev,
        loading: true,
      }));
      listBankAccountByUserId({
        id: currentUser.id,
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
    getUserBankAccounts();
  }, [currentUser?.id]);

  return (
    <GlobalAuth.Provider
      value={{
        ...state,
        setState,
        handleSignOut,
        handleSignIn,
        getUserBankAccounts,
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
