import { AppModelResponse, FirebaseFilterFor, Pagination } from "@/@types";
import {
  collection,
  getDocs,
  query,
  where,
  limit,
  startAfter,
  startAt,
  QueryFieldFilterConstraint,
  QueryStartAtConstraint,
  orderBy,
  Query,
  DocumentData,
  limitToLast,
  getCountFromServer,
} from "firebase/firestore";
import { firebaseDB } from "@/services/firebase";
import { debugDev } from "@/utils/dev";
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

  let snapShot;

  let firebaseQuery = query(ref, ...whereList);

  snapShot = await getDocs(firebaseQuery);
  const list: T[] = [];
  snapShot.forEach((doc) => {
    list.push(doc.data() as T);
  });
  return list;
};
