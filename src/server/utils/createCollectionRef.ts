import { firebaseDB } from "@/services/firebase";
import { collection, doc } from "firebase/firestore";
import { FirebaseCollection } from "../firebase/index";

export const createCollectionRef = ({
  collectionName,
}: {
  collectionName: FirebaseCollection;
}) => {
  let path = "test";
  if (process.env.NODE_ENV === "production") {
    path = "production";
  } else if (process.env.NODE_ENV === "development") {
    path = "development";
  } // Add more conditions if needed

  const ref = collection(firebaseDB, `env/${path}/${collectionName}`);

  return ref;
};
