import { format } from "date-fns";
import { Timestamp } from "firebase/firestore";

export const formatTimestamp = (
  value: Timestamp,
  formatValue = "dd/MM/yyyy"
) => {
  return format(value.toDate(), formatValue);
};
