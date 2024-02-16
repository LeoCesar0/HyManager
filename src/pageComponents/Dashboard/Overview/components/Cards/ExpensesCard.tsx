import { LocalizedText } from "@/@types";
import { useGlobalContext } from "@/contexts/GlobalContext";
import { CardRoot } from "./CardRoot";
import { HiTrendingDown } from "react-icons/hi";

export type ExpensesCardProps = {
  title: LocalizedText;
  values: {
    value: string;
    title: LocalizedText;
  }[];
};

export const ExpensesCard = (card: ExpensesCardProps) => {
  const { currentLanguage } = useGlobalContext();

  return (
    <>
      <CardRoot Icon={HiTrendingDown} title={card.title}
        className={"bg-gradient-to-r from-card from-25% to-debit"}
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
