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
} from "firebase/firestore";
import { firebaseDB } from "src/services/firebase";
import { debugDev } from "src/utils/dev";
import { FirebaseCollection } from ".";

type IFirebaseList<T> = {
  collection: FirebaseCollection;
  filters?: FirebaseFilterFor<T>[];
  pagination?: Pagination;
};
export const firebaseList = async <T>({
  collection: collectionName,
  filters = [],
  pagination,
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

  let query_ = query(ref, ...whereList);

  if (pagination) {
    query_ = query(
      ref,
      ...whereList,
      orderBy("createdAt", "desc"),
      startAfter(pagination.page * pagination.limit),
      limit(pagination.limit)
    );
  }

  snapShot = await getDocs(query_);
  const list: T[] = [];
  snapShot.forEach((doc) => {
    list.push(doc.data() as T);
  });
  return list;
};
