import { debounce } from "lodash";
import React, {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
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
  loading: boolean;
}

const initialValues = {
  currentUser: null,
  menuIsOpen: false,
  loading: false,
};
const GlobalAuth = createContext<GlobalAuthProps>(
  initialValues as GlobalAuthProps
);

const handleGetUserByUID = (
  uid: string,
  setState: Dispatch<SetStateAction<GlobalAuthProps>>
) => {
  setState((prev) => ({ ...prev, loading: true }));
  getUserByUid({
    uid: uid,
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

// const debouceGetUserById = debounce(
//   (uid: string, setState: Dispatch<SetStateAction<GlobalAuthProps>>) => {
//     setState((prev) => ({ ...prev, loading: true }));
//     getUserByUid({
//       uid: uid,
//     })
//       .then((foundUserResponse) => {
//         setState((prev) => ({
//           ...prev,
//           currentUser: foundUserResponse.data,
//         }));
//       })
//       .catch((err) => {
//         setState((prev) => ({ ...prev, currentUser: null }));
//       })
//       .finally(() => {
//         setState((prev) => ({ ...prev, loading: false }));
//       });
//   }
// );

export const GlobalAuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, setState] = useState<GlobalAuthProps>(
    initialValues as GlobalAuthProps
  );

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
      handleGetUserByUID(user.uid, setState);
    }
  });

  /* ------------------------------ handleSignOut ----------------------------- */
  const handleSignOut = async () => {
    await signOut();
  };
  /* ------------------------------ handleSignIn ------------------------------ */
  const handleSignIn = async () => {
    setState((prev) => ({ ...prev, loading: true }));
    const { data, error } = await signIn();

    if (error) ShowErrorToast(error);

    setState((prev) => ({
      ...prev,
      currentUser: data,
      loading: false,
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
