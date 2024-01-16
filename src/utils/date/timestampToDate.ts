import { Timestamp } from "firebase/firestore";

export const timestampToDate = (timestamp: Timestamp) => {
    const date = new Date(timestamp.seconds * 1000);
    return date;
  };