import { AppModelResponse } from "@types-folder/index";
import {
  collection,
  addDoc,
  getDoc,
  doc,
  setDoc,
  deleteDoc,
} from "firebase/firestore";
import { firebaseDB } from "src/services/firebase";
import { debugDev } from "src/utils/dev";

export enum FirebaseCollection {
  users = "users",
  bankAccounts = "bankAccounts",
  transactions = "transactions",
}

export const firebaseCollections = Object.values(FirebaseCollection);

const addData = <T>(collectionName: FirebaseCollection, data: T) => {
  const docRef = collection(firebaseDB, collectionName);
  return addDoc(docRef, data);
};

const updateData = (
  collectionName: FirebaseCollection,
  data: any,
  docId: string
) => {
  const docRef = doc(firebaseDB, collectionName, docId);
  return setDoc(docRef, data, { merge: true });
};

const getDataById = <T>(collectionName: FirebaseCollection, id: string) => {
  const docRef = doc(firebaseDB, collectionName, id);
  return getDoc(docRef);
};

/* --------------------------------- CREATE --------------------------------- */

type IFirebaseCreate = {
  collection: FirebaseCollection;
  data: any;
};
export const firebaseCreate = async <T>({
  collection: collectionName,
  data,
}: IFirebaseCreate): Promise<AppModelResponse<T>> => {
  const funcName = "firebaseCreate";
  try {
    const docRef = await addData<T>(collectionName, data);
    const snapShot = await getDataById<T>(collectionName, docRef.id);
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
  data: T;
  id: string;
};
export const firebaseUpdate = async <T>({
  collection: collectionName,
  data,
  id,
}: IFirebaseUpdate<T>): Promise<AppModelResponse<T>> => {
  const funcName = "firebaseUpdate";

  try {
    updateData(collectionName, data, id);
    const snapShot = await getDataById<T>(collectionName, id);
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
export const firebaseGet = async <T>({
  collection: collectionName,
  id,
}: IFirebaseGet): Promise<AppModelResponse<T>> => {
  const funcName = "firebaseGet";

  try {
    const snapShot = await getDataById<T>(collectionName, id);
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

  try {
    const docRef = doc(firebaseDB, collectionName, id);
    await deleteDoc(docRef);
    return {
      data: id,
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
