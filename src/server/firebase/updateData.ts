import { doc, setDoc } from "firebase/firestore";
import { firebaseDB } from "@/services/firebase";
import { FirebaseCollection } from ".";
import { createDocRef } from "../utils/createDocRef";

export const updateData = (
    collectionName: FirebaseCollection,
    data: any,
    docId: string
  ) => {
    const docRef = createDocRef({
      collection: collectionName,
      id: docId
    })
    return setDoc(docRef, data, { merge: true });
  };