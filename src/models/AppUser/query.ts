import {
  GetAppUserByIdDocument,
  GetAppUserByIdQuery,
  GetAppUserByIdQueryVariables,
  GetAppUserByUIdDocument,
  GetAppUserByUIdQuery,
  GetAppUserByUIdQueryVariables,
} from "../../graphql/generated";
import { apolloClient } from "../../lib/apollo";
import { CurrentUser } from "../../types/models/AppUser";
import { debugDev } from "../../utils/dev";

interface IGetUserByUid {
  data: CurrentUser | null;
  done: boolean;
  error: { message: string } | null;
}
export const getUserByUid = async (
  values: GetAppUserByUIdQueryVariables
): Promise<IGetUserByUid> => {
  const funcName = "getUserById";
  return apolloClient
    .query<GetAppUserByUIdQuery>({
      query: GetAppUserByUIdDocument,
      variables: values,
    })
    .then(({ data, error, errors }) => {
      const dataValue = data.appUser || null;
      if (data.appUser) {
        debugDev({
          type: "success",
          name: funcName,
          value: dataValue,
        });
        return {
          data: dataValue,
          error: null,
          done: true,
        };
      } else {
        debugDev({ type: "error", name: funcName, value: errors });
        debugDev({ type: "error", name: funcName, value: error });
        return {
          data: null,
          error: {
            message: "User not found",
          },
          done: false,
        };
      }
    })
    .catch((error) => {
      debugDev({ type: "error", name: funcName, value: error });
      return {
        data: null,
        error: error,
        done: false,
      };
    });
};

interface IGetUserById {
  data: GetAppUserByIdQuery["appUser"] | null;
  done: boolean;
  error: { message: string } | null;
}
export const getUserById = async (
  values: GetAppUserByIdQueryVariables
): Promise<IGetUserById> => {
  const funcName = "getUserById";
  return apolloClient
    .query<GetAppUserByIdQuery>({
      query: GetAppUserByIdDocument,
      variables: values,
    })
    .then(({ data, error, errors }) => {
      if (data.appUser) {
        debugDev({
          type: "success",
          name: funcName,
          value: data.appUser,
        });
        return {
          data: data.appUser,
          error: null,
          done: true,
        };
      } else {
        debugDev({ type: "error", name: funcName, value: errors });
        debugDev({ type: "error", name: funcName, value: error });
        return {
          data: null,
          error: {
            message: "User not found",
          },
          done: false,
        };
      }
    })
    .catch((error) => {
      debugDev({ type: "error", name: funcName, value: error });
      return {
        data: null,
        error: error,
        done: false,
      };
    });
};
