import { AnyObject, AppModelResponse } from "@/@types";
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
}: IFirebaseCreate): Promise<T | undefined> => {
  const funcName = "firebaseCreate";
  debugDev({ name: funcName, type: "call", value: data });
  const id = data.id || uuid();
  await addData(collectionName, data, id);
  const snapShot = await getDataById(collectionName, id);
  const updatedData = snapShot.data() as T | undefined;

  return updatedData;
};
