import { deleteDoc, doc } from "firebase/firestore";
import { firebaseDB } from "@/services/firebase";
import { debugDev } from "@/utils/dev";
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
  const docRef = doc(firebaseDB, collectionName, id);
  await deleteDoc(docRef);
  
};
