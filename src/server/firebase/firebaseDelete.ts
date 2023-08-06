import { deleteDoc, doc } from "firebase/firestore";
import { firebaseDB } from "src/services/firebase";
import { debugDev } from "src/utils/dev";
import { FirebaseCollection } from ".";

type IFirebaseDelete = {
    collection: FirebaseCollection;
    id: string;
  };
  export const firebaseDelete = async ({
    collection: collectionName,
    id,
  }: IFirebaseDelete) => {
    const funcName = "firebaseDelete";
    debugDev({
      name: funcName,
      type: "call",
      value: {
        id,
        collectionName,
      },
    });
    try {
      const docRef = doc(firebaseDB, collectionName, id);
      await deleteDoc(docRef);
      return {
        data: {
          id,
        },
        done: true,
        error: null,
      };
    } catch (error) {
      const errorMessage = debugDev({
        type: "error",
        name: funcName,
        value: error,
      });
      return {
        data: null,
        done: false,
        error: {
          message: errorMessage,
        },
      };
    }
  };