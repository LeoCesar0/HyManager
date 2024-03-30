import { FirebaseFilterFor } from "@/@types";
import { getDocs, query, where } from "firebase/firestore";
import { debugDev } from "@/utils/dev";
import { FirebaseCollection } from ".";
import { createCollectionRef } from "../utils/createCollectionRef";

type IFIrebaseGetWhere<T> = {
  collection: FirebaseCollection;
  filters: FirebaseFilterFor<T>[];
};
export const firebaseGetWhere = async <T>({
  collection: collectionName,
  filters,
}: IFIrebaseGetWhere<T>): Promise<T> => {
  const funcName = "firebaseList";
  debugDev({
    name: funcName,
    type: "call",
    value: {
      collectionName,
    },
  });
  const ref = createCollectionRef({ collectionName });

  filters = filters.reduce((acc, entry) => {
    // --------------------------
    // Remove duplicates
    // --------------------------
    if (!acc.find((filter) => filter.field === entry.field)) {
      acc.push(entry);
    }
    return acc;
  }, [] as typeof filters);

  let whereList = filters.map(({ field, operator = "==", value }) =>
    where(field as string, operator, value)
  );

  let snapShot;

  let firebaseQuery = query(ref, ...whereList);

  snapShot = await getDocs(firebaseQuery);
  const item: T = snapShot.docs[0].data() as T;

  return item;
};
