import { gql } from "@apollo/client";
import {
  CreateTransactionMutationVariables,
  GetTransactionsByBankDocument,
  PublishManyTransactionsDocument,
  PublishManyTransactionsMutation,
  GetTransactionsByBankQuery,
} from "@graphql-folder/generated";
import { apolloClient } from "src/lib/apollo";
import { makeTransactionSlug } from "src/utils/app";
import { debugDev } from "src/utils/dev";

interface ICreateTransactions {
  transactionsValues: CreateTransactionMutationVariables[];
  bankAccountId: string;
}

export const createManyTransactions = async ({
  transactionsValues,
  bankAccountId,
}: ICreateTransactions) => {
  if (transactionsValues.length <= 0) {
    return {
      done: false,
      error: {
        message: "Not a single transaction",
      },
      data: null,
    };
  }
  const existingTransactionsResponse =
    await apolloClient.query<GetTransactionsByBankQuery>({
      query: GetTransactionsByBankDocument,
      variables: {
        id: bankAccountId,
      },
    });

  const existingTransactions =
    existingTransactionsResponse.data?.transactions || [];

  const transactionSlugsToPublish: string[] = [];
  const transactionsRemoved: typeof transactionsValues = [];

  transactionsValues = transactionsValues.filter((transaction) => {
    const alreadyExist = existingTransactions.find(
      (item) => item.slug === transaction.slug
    );
    if (alreadyExist) {
      console.log("// alreadyExist transaction //");
      console.log("Removing transaction -->", transaction);
      console.log("alreadyExist -->", alreadyExist);
      transactionsRemoved.push(transaction);
    }
    return !alreadyExist;
  });

  const mutationString = transactionsValues
    .map((transaction) => {
      const {
        amount,
        description,
        color,
        date,
        type,
        creditor,
        idFromBankTransaction,
        slug,
      } = transaction;
      transactionSlugsToPublish.push(slug);

      let stringValues = `idFromBankTransaction: "${idFromBankTransaction}", amount: ${amount}, description: "${description}", type: ${type}, date: "${date}"`;
      stringValues += `slug: "${slug}"`;
      if (color) stringValues += `color: ${JSON.stringify(color)},`;
      if (creditor) stringValues += `creditor: "${creditor}"`;

      return `createTransaction(data: { ${stringValues}, bankAccount: { connect: { id: "${bankAccountId}" } } }) { id, date, amount }`;
    })
    .join("\n");

  const mutation = gql`
    mutation {
      ${mutationString}
    }
  `;

  console.log("transactionsRemoved.length -->", transactionsRemoved.length);

  return apolloClient
    .mutate({ mutation })
    .then(async (result) => {
      if (result.data) {
        const { data, done, error } = await publishManyTransactionsByBankId({
          bankAccountId: bankAccountId,
        });
        return {
          done: done,
          error: error,
          data: data,
        };
      } else {
        const errorMessage = debugDev({
          type: "error",
          name: "createManyTransactions",
          value: result.errors,
        });
        return {
          done: false,
          error: {
            message: errorMessage,
          },
          data: null,
        };
      }
    })
    .catch((error) => {
      // Handle network errors
      debugDev({
        type: "error",
        name: "createManyTransactions",
        value: error,
      });
      return {
        done: false,
        error: {
          message: "Error when creating transactions",
        },
        data: null,
      };
    });
};

interface IPublishManyTransactionsByBankId {
  bankAccountId: string;
}

const publishManyTransactionsByBankId = async ({
  bankAccountId,
}: IPublishManyTransactionsByBankId) => {
  return apolloClient
    .mutate<PublishManyTransactionsMutation>({
      mutation: PublishManyTransactionsDocument,
      variables: {
        bankAccountId: bankAccountId,
      },
      refetchQueries: [
        {
          query: GetTransactionsByBankDocument,
          variables: { id: bankAccountId },
        },
      ],
    })
    .then((result) => {
      if (result.data?.publishManyTransactions) {
        return {
          done: true,
          error: null,
          data: result.data.publishManyTransactions,
        };
      }
      const errorMessage = debugDev({
        type: "error",
        name: "publishManyTransactionsByBankId",
        value: result.errors,
      });
      return {
        done: false,
        error: {
          message: errorMessage,
        },
        data: null,
      };
    })
    .catch((error) => {
      debugDev({
        type: "error",
        name: "publishManyTransactionsByBankId",
        value: error,
      });
      return {
        done: false,
        error: {
          message: "Error when publishing transactions",
        },
        data: null,
      };
    });
};

/* ----------------------------------- OLD ---------------------------------- */

// interface IPublishManyTransactions {
//   transactionsSlugs: string[];
//   bankAccountId: string;
// }

// const publishManyTransactions = async ({
//   transactionsSlugs,
//   bankAccountId,
// }: IPublishManyTransactions) => {
//   if (transactionsSlugs.length <= 0) {
//     return {
//       done: false,
//       error: {
//         message: "Error on publishing transactions, no transaction slugs",
//       },
//       data: null,
//     };
//   }

//   const mutationString = transactionsSlugs
//     .map((slug) => {
//       return `publishTransaction(where: {bankAccount: {id: "${bankAccountId}"}, AND: {slug: "${slug}"}}, to: PUBLISHED){
//         id
//         slug
//       }`;
//     })
//     .join("\n");

//   const mutation = gql`
//     mutation {
//       ${mutationString}
//     }
//   `;

//   return apolloClient
//     .mutate({ mutation })
//     .then((result) => {
//       // handle success
//       if (result.data) {
//         return {
//           done: true,
//           error: null,
//           data: result.data,
//         };
//       } else {
//         const errorMessage = debugDev({
//           type: "error",
//           name: "publishManyTransactions",
//           value: result.errors,
//         });
//         return {
//           done: false,
//           error: {
//             message: errorMessage,
//           },
//           data: null,
//         };
//       }
//     })
//     .catch((error) => {
//       // Handle network errors
//       debugDev({
//         type: "error",
//         name: "publishManyTransactions",
//         value: error,
//       });
//       return {
//         done: false,
//         error: {
//           message: "Error when publishing transactions",
//         },
//         data: null,
//       };
//     });
// };
