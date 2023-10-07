import { FirebaseCollection } from "@server/firebase";
import { firebaseDelete } from "@server/firebase/firebaseDelete";
import { AppModelResponse } from "@/@types/index";
import { debugDev } from "src/utils/dev";

interface IDeleteUser {
  id: string;
}

export const deleteUser = async ({
  id,
}: IDeleteUser): Promise<AppModelResponse<{ id: string }>> => {
  const funcName = "deleteUser";
  try {
    await firebaseDelete({
      collection: FirebaseCollection.users,
      id: id,
    });
    return {
      data: {
        id,
      },
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
