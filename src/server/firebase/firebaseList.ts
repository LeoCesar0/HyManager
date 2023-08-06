import { AppModelResponse, FirebaseFilterFor } from "@types-folder";
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
  
  
  