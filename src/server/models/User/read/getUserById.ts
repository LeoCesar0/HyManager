import { FirebaseCollection } from "@server/firebase";
import { firebaseGet } from "@server/firebase/firebaseGet";
import { AppModelResponse } from "@/@types/index";
import { debugDev } from "@/utils/dev";
import { User } from "../schema";

interface IGetUserById {
  id: string;
}

export const getUserById = async ({
  id,
}: IGetUserById): Promise<AppModelResponse<User>> => {
  const funcName = "getUserById";

  try {
    const data = await firebaseGet<User>({
      collection: FirebaseCollection.users,
      id: id,
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
    console.log("Catch error -->", error);
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
