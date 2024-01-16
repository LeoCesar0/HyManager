import { AppModelResponse } from "@/@types/index";
import { debugDev } from "@/utils/dev";
import { CreateUser, User } from "../schema";
import { Timestamp } from "firebase/firestore";
import { firebaseCreate } from "@server/firebase/firebaseCreate";
import { FirebaseCollection } from "@server/firebase";

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
    const data = await firebaseCreate<User>({
      collection: FirebaseCollection.users,
      data: item,
    });
    if (data) {
      return {
        data: data,
        done: true,
        error: null,
      };
    }
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
