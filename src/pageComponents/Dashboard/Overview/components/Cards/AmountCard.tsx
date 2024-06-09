import { LocalizedText } from "@/@types";
import { useGlobalContext } from "@/contexts/GlobalContext";
import { CardRoot } from "./CardRoot";
import { HiTrendingDown } from "react-icons/hi";
import clsx from "clsx";

export type AmountCardProps = {
  title: LocalizedText;
  values: {
    value: string;
    title: LocalizedText;
  }[];
  type: "expenses" | "deposits";
};

export const AmountCard = (card: AmountCardProps) => {
  const { currentLanguage } = useGlobalContext();

  return (
    <>
      <CardRoot
        Icon={HiTrendingDown}
        title={card.title}
        className={clsx("bg-gradient-to-r from-card from-25%", {
          "to-debit": card.type === "expenses",
          "to-deposit": card.type === "deposits",
        })}
      >
        <div className="flex flex-row justify-between gap-2">
          {card.values.map((value, index) => {
            return (
              <div key={index}>
                <h4 className="text-sm font-medium text-card-foreground">
                  {value.value}
                </h4>
                <p className="text-xs font-normal text-accent-foreground">
                  {value.title[currentLanguage]}
                </p>
              </div>
            );
          })}
        </div>
      </CardRoot>
    </>
  );
};
