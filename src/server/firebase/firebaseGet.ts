import { AppModelResponse } from "@types-folder";
import { debugDev } from "src/utils/dev";
import { FirebaseCollection } from ".";
import { getDataById } from "./getDataById";

type IFirebaseGet = {
    collection: FirebaseCollection;
    id: string;
  };
  
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