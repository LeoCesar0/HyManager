import { AppModelResponse } from "@types-folder/index";
import { debugDev } from "src/utils/dev";
import { FirebaseCollection, firebaseGet } from "..";
import { User } from "./schema";

interface IGetUserById {
  id: string;
}

export const getUserById = async ({
  id,
}: IGetUserById): Promise<AppModelResponse<User>> => {
  const funcName = "getUserById";

  try {
    const result = await firebaseGet<User>({
      collection: FirebaseCollection.users,
      id: id,
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
