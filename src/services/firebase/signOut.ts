import { firebaseAuth } from ".";
import { signOut as firebaseSignOut } from "firebase/auth";

export const signOut = async () => {
  await firebaseSignOut(firebaseAuth);
};
