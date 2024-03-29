import { listBankAccountByUserId } from "@models/BankAccount/read/listBankAccountByUserId";
import { getUserById } from "@models/User/read/getUserById";
import { useRouter } from "next/navigation";
import React, {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useState,
} from "react";
import { BankAccount } from "@/server/models/BankAccount/schema";
import { User } from "@/server/models/User/schema";
import { signIn } from "@/services/firebase/signIn";
import { signOut } from "@/services/firebase/signOut";
import { firebaseAuth } from "../services/firebase";
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

  /* ------------------------------ bank accounts ----------------------------- */
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

  // useEffect(() => {
  //   getUserBankAccounts();
  // }, [currentUser?.id]);

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
