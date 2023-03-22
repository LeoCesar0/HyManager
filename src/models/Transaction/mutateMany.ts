import { gql } from "@apollo/client";
import {
  CreateTransactionMutationVariables,
  PublishManyTransactionsDocument,
  PublishManyTransactionsMutation,
} from "@graphql-folder/generated";
import { apolloClient } from "src/lib/apollo";
import { makeTransactionSlug } from "src/utils/app";
import { debugDev } from "src/utils/dev";

interface ICreateTransactions {
  transactionsValues: CreateTransactionMutationVariables[];
}

export const createManyTransactions = async ({
  transactionsValues,
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
  const transactionSlugsToPublish: string[] = [];
  let bankId = "";

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
        bankAccountId,
      } = transaction;
      bankId = bankAccountId;
      const slug =
        transaction.slug ||
        makeTransactionSlug({
          amount: amount.toString(),
          date,
        });
      transactionSlugsToPublish.push(slug);

      let stringValues = `idFromBankTransaction: "${idFromBankTransaction}", amount: ${amount}, description: "${description}", type: ${type}, date: "${date}"`;
      if (slug) stringValues += `slug: "${slug}"`;
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

  return apolloClient
    .mutate({ mutation })
    .then(async (result) => {
      if (result.data) {
        const { data, done, error } = await publishManyTransactionsByBankId({
          bankAccountId: bankId,
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
