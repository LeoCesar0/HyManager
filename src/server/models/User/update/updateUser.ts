import { FirebaseCollection } from "@server/firebase";
import { firebaseUpdate } from "@server/firebase/firebaseUpdate";
import { AppModelResponse } from "@/@types/index";
import { debugDev } from "@/utils/dev";
import { User } from "../schema";

type PartialItem = Partial<User>;

interface IUpdateUser {
  values: PartialItem;
  id: string;
}

export const updateUser = async ({
  values,
  id,
}: IUpdateUser): Promise<AppModelResponse<User>> => {
  const funcName = "updateUser";
  try {
    const result = await firebaseUpdate<User>({
      collection: FirebaseCollection.users,
      data: values,
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
