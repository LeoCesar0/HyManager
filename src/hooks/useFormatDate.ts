import { useGlobalContext } from "@/contexts/GlobalContext";
import { format } from "date-fns";

export const useFormatDate = (...args: Parameters<typeof format>) => {
  const { currentDateLocale } = useGlobalContext();

  if (!args[0]) return "";

  return format(args[0], args[1], {
    ...[args[2] || {}],
    locale: currentDateLocale
  });
};
