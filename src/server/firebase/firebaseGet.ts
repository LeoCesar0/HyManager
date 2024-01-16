import { AppModelResponse } from "@/@types";
import { debugDev } from "@/utils/dev";
import { FirebaseCollection } from ".";
import { getDataById } from "./getDataById";

type IFirebaseGet = {
  collection: FirebaseCollection;
  id: string;
};

export const firebaseGet = async <T>({
  collection: collectionName,
  id,
}: IFirebaseGet): Promise<T | undefined> => {
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

  return data;
};
