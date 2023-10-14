import { AppModelResponse, FirebaseFilterFor } from "@/@types";
import { collection, getDocs, query, where } from "firebase/firestore";
import { firebaseDB } from "src/services/firebase";
import { debugDev } from "src/utils/dev";
import { FirebaseCollection } from ".";

type IFirebaseList<T> = {
  collection: FirebaseCollection;
  filters?: FirebaseFilterFor<T>[];
};
export const firebaseList = async <T>({
  collection: collectionName,
  filters = [],
}: IFirebaseList<T>): Promise<T[]> => {
  const funcName = "firebaseList";
  debugDev({
    name: funcName,
    type: "call",
    value: {
      collectionName,
    },
  });
  const ref = collection(firebaseDB, collectionName);
  let whereList = filters.map(({ field, operator = "==", value }) =>
    where(field as string, operator, value)
  );
  const query_ = filters.length > 0 ? query(ref, ...whereList) : query(ref);
  const snapShot = await getDocs(query_);
  const list: T[] = [];
  
  snapShot.forEach((doc) => {
    list.push(doc.data() as T);
  });

  return list
};
