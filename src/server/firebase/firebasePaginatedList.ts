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
  Index,
} from "firebase/firestore";
import { firebaseDB } from "@/services/firebase";
import { debugDev } from "@/utils/dev";
import { FirebaseCollection } from ".";
import { PaginationResult } from "../../@types/index";
import { createCollectionRef } from "../utils/createCollectionRef";

type IProps<T> = {
  collection: FirebaseCollection;
  filters?: FirebaseFilterFor<T>[];
  pagination: Pagination;
};
export const firebasePaginatedList = async <T>({
  collection: collectionName,
  filters = [],
  pagination,
}: IProps<T>): Promise<PaginationResult<T>> => {
  const funcName = "firebaseList";
  debugDev({
    name: funcName,
    type: "call",
    value: {
      collectionName,
    },
  });
  const ref = createCollectionRef({ collectionName });
  let whereList = filters.map(({ field, operator = "==", value }) =>
    where(field as string, operator, value)
  );

  let snapShot;

  let firebaseQuery: Query<DocumentData>;

  const orderByValues = pagination.orderBy ?? {
    field: "createdAt",
    direction: "desc",
  };

  firebaseQuery = query(
    ref,
    ...whereList,
    orderBy(orderByValues.field, orderByValues.direction)
  );

  snapShot = await getDocs(firebaseQuery);
  let list: T[] = snapShot.docs.map((doc) => doc.data() as T);

  const count = list.length;
  const totalPages = Math.ceil(count / pagination.limit);

  list = list.slice(
    (pagination.page - 1) * pagination.limit,
    pagination.page * pagination.limit
  );

  return {
    count: count,
    pages: totalPages,
    list: list,
    currentPage: pagination.page,
  };
};
