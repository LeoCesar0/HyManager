import React, {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useState,
} from "react";
import { getUserByUid } from "../models/AppUser/query";
import { firebaseAuth, signIn, signOut } from "../services/firebase";
import { CurrentUser } from "../types/models/AppUser";
import { ShowErrorToast } from "../utils/app";

interface GlobalAuthProps {
  currentUser: CurrentUser | null;
  menuIsOpen: boolean;
  setState: Dispatch<SetStateAction<GlobalAuthProps>>;
  handleSignIn: () => void;
  handleSignOut: () => void;
}

const initialValues = {
  currentUser: null,
  menuIsOpen: false,
};
const GlobalAuth = createContext<GlobalAuthProps>(
  initialValues as GlobalAuthProps
);

export const GlobalAuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, setState] = useState<GlobalAuthProps>(
    initialValues as GlobalAuthProps
  );

  const { currentUser } = state;

  firebaseAuth.onAuthStateChanged((user) => {
    if (user === null) {
      setState((prev) => ({ ...prev, currentUser: user }));
      return;
    }
    if (user.uid !== currentUser?.uid) {
      getUserByUid({
        uid: user.uid,
      })
        .then((foundUserResponse) => {
          setState((prev) => ({
            ...prev,
            currentUser: foundUserResponse.data,
          }));
        })
        .catch((err) => {
          setState((prev) => ({ ...prev, currentUser: null }));
        });
    }
  });

  const handleSignOut = async () => {
    setState((prev) => ({
      ...prev,
      currentUser: null,
    }));
    await signOut();
  };

  const handleSignIn = async () => {
    const { data, error } = await signIn();

    if (error) ShowErrorToast(error);

    setState((prev) => ({
      ...prev,
      currentUser: data,
    }));
  };

  return (
    <GlobalAuth.Provider
      value={{
        ...state,
        setState,
        handleSignOut,
        handleSignIn,
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
