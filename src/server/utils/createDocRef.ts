import { firebaseDB } from "@/services/firebase";
import { doc } from "firebase/firestore";
import { FirebaseCollection } from "../firebase/index";
import { getServerPath } from "./getServerPath";

export const createDocRef = ({
  collection,
  id,
}: {
  collection: FirebaseCollection;
  id: string;
}) => {
  const path = getServerPath();

  const ref = doc(firebaseDB, `env/${path}/${collection}/${id}`);

  return ref;
};
