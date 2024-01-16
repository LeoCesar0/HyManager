import { doc, getDoc } from "firebase/firestore";
import { firebaseDB } from "@/services/firebase";
import { FirebaseCollection } from ".";
import { createDocRef } from '../utils/createDocRef';

export const getDataById = (collectionName: FirebaseCollection, id: string) => {
    const docRef = createDocRef({
      collection: collectionName,
      id: id
    })
    return getDoc(docRef);
  };