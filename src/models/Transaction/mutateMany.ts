import { gql } from "@apollo/client";
import { CreateTransactionMutationVariables } from "@graphql-folder/generated";
import { apolloClient } from "src/lib/apollo";
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

  const mutationString = transactionsValues
    .map((transaction) => {
      const {
        amount,
        description,
        color,
        date,
        type,
        slug,
        creditor,
        idFromBankTransaction,
        bankAccountId,
      } = transaction;

      console.log("DATE -->", date);

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
  apolloClient
    .mutate({ mutation })
    .then((result) => {
      // handle success
      console.log("CREATE TRANSACTIONS DATA -->", result);
      if (result.data) {
        return {
          done: true,
          error: null,
          data: result.data,
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

interface IPublishManyTransactions {
  transactionsIds: string[];
}
const publishManyTransactions = async ({
  transactionsIds,
}: IPublishManyTransactions) => {
  const mutationString = transactionsIds
    .map((id) => {
      return `publishTransaction(where: {id: ${id}}){
        id
      }`;
    })
    .join("\n");

  const mutation = gql`
    mutation {
      ${mutationString}
    }
  `;
  if (mutationString.length > 0) {
    apolloClient
      .mutate({ mutation })
      .then((result) => {
        // handle success
        if (result.data) {
          return {
            done: true,
            error: null,
            data: result.data,
          };
        } else {
          const errorMessage = debugDev({
            type: "error",
            name: "publishManyTransactions",
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
          name: "publishManyTransactions",
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
  } else {
    return {
      done: false,
      error: {
        message: "Not a single transaction",
      },
      data: null,
    };
  }
};
