import { AnyObject, AppModelResponse } from "@types-folder/index";
import {
  collection,
  addDoc,
  getDoc,
  setDoc,
  deleteDoc,
  Timestamp,
  query,
  where,
  getDocs,
  WhereFilterOp,
  doc,
} from "firebase/firestore";
import { firebaseDB } from "src/services/firebase";
import { debugDev } from "src/utils/dev";
import { z } from "zod";
import { v4 as uuid } from "uuid";

export const timestampSchema = z.custom<Timestamp>((value: any) => {
  return value instanceof Timestamp;
});

export enum FirebaseCollection {
  users = "users",
  bankAccounts = "bankAccounts",
  transactions = "transactions",
}

export const firebaseCollections = Object.values(FirebaseCollection);

const addData = (collectionName: FirebaseCollection, data: any, id: string) => {
  const docRef = doc(firebaseDB, collectionName, id);
  return setDoc(docRef, data);
};

const updateData = (
  collectionName: FirebaseCollection,
  data: any,
  docId: string
) => {
  const docRef = doc(firebaseDB, collectionName, docId);
  return setDoc(docRef, data, { merge: true });
};

const getDataById = (collectionName: FirebaseCollection, id: string) => {
  const docRef = doc(firebaseDB, collectionName, id);
  return getDoc(docRef);
};

/* --------------------------------- CREATE --------------------------------- */

type IFirebaseCreate = {
  collection: FirebaseCollection;
  data: AnyObject & { id: string };
};
export const firebaseCreate = async <T extends { id: string }>({
  collection: collectionName,
  data,
}: IFirebaseCreate): Promise<AppModelResponse<T>> => {
  const funcName = "firebaseCreate";
  debugDev({ name: funcName, type: "call", value: data });
  try {
    const id = data.id || uuid();
    await addData(collectionName, data, id);
    const snapShot = await getDataById(collectionName, id);
    const updatedData = snapShot.data() as T | undefined;
    return {
      data: updatedData || null,
      done: !!updatedData,
      error: updatedData
        ? null
        : {
            message: debugDev({
              type: "error",
              name: funcName,
              value: "Error",
            }),
          },
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

/* --------------------------------- UPDATE --------------------------------- */

type IFirebaseUpdate<T> = {
  collection: FirebaseCollection;
  data: Partial<T> & Partial<{ id: string; createdAt: Timestamp }>;
  id: string;
};
export const firebaseUpdate = async <T>({
  collection: collectionName,
  data,
  id,
}: IFirebaseUpdate<T>): Promise<AppModelResponse<T>> => {
  const funcName = "firebaseUpdate";
  debugDev({ name: funcName, type: "call", value: data });

  if (data?.id) delete data.id;
  if (data?.createdAt) delete data.createdAt;

  try {
    updateData(collectionName, data, id);
    const snapShot = await getDataById(collectionName, id);
    const updatedData = snapShot.data() as T | undefined;
    return {
      data: updatedData || null,
      done: !!updatedData,
      error: updatedData
        ? null
        : {
            message: debugDev({
              type: "error",
              name: funcName,
              value: "Error",
            }),
          },
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

/* --------------------------------- Get --------------------------------- */

type IFirebaseGet = {
  collection: FirebaseCollection;
  id: string;
};
// export const firebaseGet = async <T>({
//   collection: collectionName,
//   id,
// }: IFirebaseGet): Promise<AppModelResponse<T>> => {
//   const funcName = "firebaseGet";

//   try {
//     const snapShot = await getDataById<T>(collectionName, id);
//     const data = snapShot.data() as T | undefined;
//     return {
//       data: data || null,
//       done: !!data,
//       error: data
//         ? null
//         : {
//             message: debugDev({
//               type: "error",
//               name: funcName,
//               value: "Error",
//             }),
//           },
//     };
//   } catch (error) {
//     const errorMessage = debugDev({
//       type: "error",
//       name: funcName,
//       value: error,
//     });
//     return {
//       data: null,
//       done: false,
//       error: {
//         message: errorMessage,
//       },
//     };
//   }
// };
export const firebaseGet = async <T>({
  collection: collectionName,
  id,
}: IFirebaseGet): Promise<AppModelResponse<T>> => {
  const funcName = "firebaseGet";
  debugDev({
    name: funcName,
    type: "call",
    value: {
      id,
      collectionName,
    },
  });

  const snapShot = await getDataById(collectionName, id);
  const data = snapShot.data() as T | undefined;
  return {
    data: data || null,
    done: !!data,
    error: data
      ? null
      : {
          message: debugDev({
            type: "error",
            name: funcName,
            value: "Error",
          }),
        },
  };
};
/* --------------------------------- DELETE --------------------------------- */

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

/* ---------------------------------- LIST ---------------------------------- */

type IFirebaseList<T> = {
  collection: FirebaseCollection;
  filters?: {
    field: keyof T;
    operator: WhereFilterOp;
    value: any;
  }[];
};
export const firebaseList = async <T>({
  collection: collectionName,
  filters = [],
}: IFirebaseList<T>): Promise<AppModelResponse<T[]>> => {
  const funcName = "firebaseList";
  debugDev({
    name: funcName,
    type: "call",
    value: {
      collectionName,
    },
  });
  try {
    const ref = collection(firebaseDB, collectionName);
    let whereList = filters.map(({ field, operator = "==", value }) =>
      where(field as string, operator, value)
    );
    const q = filters.length > 0 ? query(ref, ...whereList) : query(ref);
    const snapShot = await getDocs(q);
    const list: T[] = [];
    snapShot.forEach((doc) => {
      list.push(doc.data() as T);
    });
    return {
      data: list,
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
