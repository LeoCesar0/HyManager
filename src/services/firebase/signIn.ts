import {
    GoogleAuthProvider,
    signInWithPopup,
    setPersistence,
    browserLocalPersistence,
  } from "firebase/auth";
  import { v4 as uuidv4 } from "uuid";
  import { debugDev } from "../../utils/dev";
  import { AppModelResponse } from "../../types";
  import { getUserById } from "src/server/models/User/read";
  import { createUser } from "src/server/models/User/create";
  import { User } from "src/server/models/User/schema";
import { firebaseAuth } from ".";

export type SignIn = AppModelResponse<User>;

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

      const foundUserResponse = await getUserById({
        id: userByFirebase.uid,
      });
      console.log("foundUserResponse -->", foundUserResponse);

      if (foundUserResponse.data) {
        return {
          data: foundUserResponse.data,
          error: foundUserResponse.error,
          done: foundUserResponse.done,
        };
      } else {
        const newUserResponse = await createUser({
          values: {
            email: userByFirebase.email || "",
            name: userByFirebase.displayName || `User-${uuidv4().slice(0, 5)}`,
            id: userByFirebase.uid,
            imageUrl: userByFirebase.photoURL,
          },
        });
        console.log('--> newUserResponse -->', newUserResponse)
        const newUser = (newUserResponse.data || null) as User | null;

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