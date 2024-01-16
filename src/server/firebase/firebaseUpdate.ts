import { AppModelResponse } from "@/@types";
import { Timestamp } from "firebase/firestore";
import { debugDev } from "src/utils/dev";
import { FirebaseCollection } from ".";
import { getDataById } from "./getDataById";
import { updateData } from "./updateData";

type IFirebaseUpdate<T> = {
  collection: FirebaseCollection;
  data: Partial<T> &
    Partial<{ id: string; createdAt: Timestamp; updatedAt: Timestamp }>;
  id: string;
};
export const firebaseUpdate = async <T>({
  collection: collectionName,
  data,
  id,
}: IFirebaseUpdate<T>): Promise<AppModelResponse<T>> => {
  const funcName = "firebaseUpdate";
  debugDev({ name: funcName, type: "call", value: data });
  const now = new Date();

  if (data?.id) delete data.id;
  if (data?.createdAt) delete data.createdAt;
  data.updatedAt = Timestamp.fromDate(now);

  try {
    updateData(collectionName, data, id);
    const snapShot = await getDataById(collectionName, id);
    const updatedData = snapShot.data() as T | undefined;

    if (updatedData) {
      return {
        data: updatedData,
        done: true,
        error: null,
      };
    } else {
      return {
        data: null,
        done: false,
        error: {
          message: debugDev({
            type: "error",
            name: funcName,
            value: "Error",
          }),
        },
      };
    }
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
