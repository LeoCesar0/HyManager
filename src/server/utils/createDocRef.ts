import { firebaseDB } from "@/services/firebase";
import { doc } from "firebase/firestore";
import { FirebaseCollection } from "../firebase/index";

export const createDocRef = ({
  collection,
  id,
}: {
  collection: FirebaseCollection;
  id: string;
}) => {
  let path = "test";
  if (process.env.NODE_ENV === "production") {
    path = "production";
  } else if (process.env.NODE_ENV === "development") {
    path = "development";
  } // Add more conditions if needed

  const ref = doc(firebaseDB, `env/${path}/${collection}/${id}`);

  return ref;
};
