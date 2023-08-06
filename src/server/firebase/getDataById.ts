import { doc, getDoc } from "firebase/firestore";
import { firebaseDB } from "src/services/firebase";
import { FirebaseCollection } from ".";

export const getDataById = (collectionName: FirebaseCollection, id: string) => {
    const docRef = doc(firebaseDB, collectionName, id);
    return getDoc(docRef);
  };