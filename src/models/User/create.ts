import { AppModelResponse } from "@types-folder/index";
import { debugDev } from "src/utils/dev";
import { FirebaseCollection, firebaseCreate } from "..";
import { CreateUser, User } from "./schema";
import { v4 as uuid } from "uuid";
import { Timestamp } from "firebase/firestore";

interface ICreateUser {
  values: CreateUser;
}

export const createUser = async ({
  values,
}: ICreateUser): Promise<AppModelResponse<User>> => {
  const funcName = "getUserById";
  const item: User = {
    ...values,
    createdAt: Timestamp.fromDate(new Date()),
    updatedAt: Timestamp.fromDate(new Date()),
  };
  try {
    const result = await firebaseCreate<User>({
      collection: FirebaseCollection.users,
      data: item,
    });
    return result;
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
