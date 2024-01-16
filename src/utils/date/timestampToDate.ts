import { Timestamp } from "firebase/firestore";

export const timestampToDate = (timestamp: Timestamp) => {
    // const date = new Date(timestamp.seconds * 1000);
    const date = timestamp.toDate()
    return date; 
  };