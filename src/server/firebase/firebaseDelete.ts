import { deleteDoc, doc } from "firebase/firestore";
import { debugDev } from "@/utils/dev";
import { FirebaseCollection } from ".";
import { createDocRef } from "../utils/createDocRef";

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
  const docRef = createDocRef({
    collection: collectionName,
    id: id
  })
  await deleteDoc(docRef);
  
};
