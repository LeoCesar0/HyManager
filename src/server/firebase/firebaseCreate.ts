import { AnyObject, AppModelResponse } from "@types-folder";
import { debugDev } from "src/utils/dev";
import { FirebaseCollection } from ".";
import { v4 as uuid } from "uuid";
import { addData } from "./addData";
import { getDataById } from "./getDataById";

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