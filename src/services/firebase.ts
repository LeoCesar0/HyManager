import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithRedirect,
  signInWithPopup,
  signOut as firebaseSignOut,
  getRedirectResult,
  setPersistence,
  browserSessionPersistence,
  inMemoryPersistence,
  browserLocalPersistence,
} from "firebase/auth";
import { v4 as uuidv4 } from "uuid";
import { debugDev } from "../utils/dev";
import { AppModelResponse } from "../types";
import { CurrentUser } from "../types/models/AppUser";
import { getUserByUid } from "../models/AppUser/query";
import { createNewUser } from "../models/AppUser/mutate";
// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: "hymanager.firebaseapp.com",
  projectId: "hymanager",
  storageBucket: "hymanager.appspot.com",
  messagingSenderId: "542041118868",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: "G-J21HSJDMDQ",
};

// Initialize Firebase
export const firebaseApp = initializeApp(firebaseConfig);
export const firebaseAuth = getAuth(firebaseApp);
export const firebaseDB = getFirestore(firebaseApp);
// setPersistence(firebaseAuth, browserLocalPersistence);
// const analytics = getAnalytics(app);

export const signOut = async () => {
  await firebaseSignOut(firebaseAuth);
};

export type SignIn = AppModelResponse<CurrentUser>;

export const signIn = async (): Promise<SignIn> => {
  const googleProvider = new GoogleAuthProvider();
  setPersistence(firebaseAuth, browserLocalPersistence);
  return signInWithPopup(firebaseAuth, googleProvider)
    .then(async (result) => {
      let error = null;
      console.log("Sign in result -->", result);
      if (!result) {
        error = {
          message: "Sign In Failed",
        };
        // throw new Error("SignIn Not Success");
      }
      const credential = GoogleAuthProvider.credentialFromResult(result);
      // const token = credential.accessToken;
      if (!credential) {
        error = {
          message: "Sign In Failed",
        };
        // throw new Error("SignIn Not Success");
      }
      if (error) {
        return {
          error,
          done: false,
          data: null,
        };
      }

      const userByFirebase = result.user;

      const foundUserResponse = await getUserByUid({
        uid: userByFirebase.uid,
      });
      console.log("foundUserResponse -->", foundUserResponse);

      if (foundUserResponse.data) {
        return {
          data: foundUserResponse.data,
          error: foundUserResponse.error,
          done: foundUserResponse.done,
        };
      } else {
        const newUserResponse = await createNewUser({
          email: userByFirebase.email || "",
          name: userByFirebase.displayName || `User-${uuidv4().slice(0, 5)}`,
          uid: userByFirebase.uid,
          bio: "",
          imageUrl: userByFirebase.photoURL,
        });
        const newUser = (newUserResponse.data || null) as CurrentUser | null;

        return {
          data: newUser,
          error: newUserResponse.error,
          done: newUserResponse.done,
        };
      }
    })
    .catch((error) => {
      // Handle Errors here.
      //   const errorCode = error.code;
      const errorMessage = debugDev({
        type: "error",
        name: "signIn",
        value: error,
      });
      return {
        data: null,
        error: {
          message: errorMessage,
        },
        done: false,
      };
    });
};
