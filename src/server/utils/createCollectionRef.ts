import { firebaseDB } from "@/services/firebase";
import { collection, doc } from "firebase/firestore";
import { FirebaseCollection } from "../firebase/index";
import { getServerPath } from "./getServerPath";

export const createCollectionRef = ({
  collectionName,
}: {
  collectionName: FirebaseCollection;
}) => {

  const path = getServerPath()

  const ref = collection(firebaseDB, `env/${path}/${collectionName}`);

  return ref;
};
