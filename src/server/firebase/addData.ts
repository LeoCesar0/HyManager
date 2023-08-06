import { doc, setDoc } from "firebase/firestore";
import { firebaseDB } from "src/services/firebase";
import { FirebaseCollection } from ".";

export const addData = (collectionName: FirebaseCollection, data: any, id: string) => {
    const docRef = doc(firebaseDB, collectionName, id);
    return setDoc(docRef, data);
  };