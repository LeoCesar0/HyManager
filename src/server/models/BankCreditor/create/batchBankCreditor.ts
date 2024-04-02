import { FirebaseCollection } from "@/server/firebase";
import {
  BankCreditor,
  CreateBankCreditor,
  createBankCreditorSchema,
} from "../schema";
import { WriteBatch } from "firebase/firestore";
import { createDocRef } from "@/server/utils/createDocRef";
import { slugify } from "@/utils/app";
import { makeBankCreditorId } from "../utils/makeBankCreditorId";

export type IBatchBankCreditor = {
  values: CreateBankCreditor;
  batch: WriteBatch;
};

export const batchBankCreditor = async ({
  values,
  batch,
}: IBatchBankCreditor) => {
  const item = createBankCreditorSchema.parse(values);

  item.creditorSlug = slugify(item.creditorSlug);

  const id = makeBankCreditorId({
    bankAccountId: item.bankAccountId,
    creditorSlug: item.creditorSlug,
  });

  const data: BankCreditor = {
    ...item,
    id: id,
  };

  const docRef = createDocRef({
    collection: FirebaseCollection.bankCreditors,
    id: id,
  });

  batch.set(docRef, data, { merge: true });
};
