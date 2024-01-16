import { doc, setDoc } from "firebase/firestore";
import { firebaseDB } from "@/services/firebase";
import { FirebaseCollection } from ".";
import { createDocRef } from "../utils/createDocRef";

export const addData = (
  collectionName: FirebaseCollection,
  data: any,
  id: string
) => {
  const docRef = createDocRef({
    collection: collectionName,
    id: id
  })
  return setDoc(docRef, data, { merge: true });
};
