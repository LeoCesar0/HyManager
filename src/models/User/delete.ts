import { AppModelResponse } from "@types-folder/index";
import { debugDev } from "src/utils/dev";
import { FirebaseCollection, firebaseDelete, firebaseUpdate } from "..";

interface IDeleteUser {
  id: string;
}

export const deleteUser = async ({
  id,
}: IDeleteUser): Promise<AppModelResponse<{ id: string }>> => {
  const funcName = "deleteUser";
  try {
    const result = await firebaseDelete({
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
