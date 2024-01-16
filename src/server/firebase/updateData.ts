import { doc, setDoc } from "firebase/firestore";
import { firebaseDB } from "@/services/firebase";
import { FirebaseCollection } from ".";

export const updateData = (
    collectionName: FirebaseCollection,
    data: any,
    docId: string
  ) => {
    const docRef = doc(firebaseDB, collectionName, docId);
    return setDoc(docRef, data, { merge: true });
  };