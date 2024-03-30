import { getDoc } from "firebase/firestore";
import { FirebaseCollection } from ".";
import { createDocRef } from '../utils/createDocRef';

export const getDataById = (collectionName: FirebaseCollection, id: string) => {
    const docRef = createDocRef({
      collection: collectionName,
      id: id
    })
    return getDoc(docRef);
  };