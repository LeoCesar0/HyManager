import { Timestamp } from "firebase/firestore";
import { z } from "zod";

export const timestampSchema = z.custom<Timestamp>((value: any) => {
    return value instanceof Timestamp;
  });
  
  export enum FirebaseCollection {
    users = "users",
    bankAccounts = "bankAccounts",
    transactions = "transactions",
    transactionReports = "transactionReports",
  }
  
  export const firebaseCollections = Object.values(FirebaseCollection);