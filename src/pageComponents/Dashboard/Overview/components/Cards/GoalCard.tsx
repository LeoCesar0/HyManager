import { cx, valueToCurrency } from "../../../../../utils/misc";
import { LocalizedText } from "@/@types";
import { TargetIcon } from "@radix-ui/react-icons";
import { CardRoot } from "./CardRoot";

export type GoalCardProps = {
  title: LocalizedText;
  strong?: LocalizedText;
  slider: {
    from: number;
    current: number;
    to: number;
  };
};

export const GoalCard = (card: GoalCardProps) => {
  const savingPercentage = card.slider
    ? (card.slider.current / card.slider.to) * 100
    : null;
  const redFlag = savingPercentage ? savingPercentage > 90 : false;

  return (
    <>
      <CardRoot title={card.title} strong={card.strong} Icon={TargetIcon}>
        <div className="mb-[-0.5rem]">
          <div className="rounded-lg h-4 overflow-hidden border neo-pressed-1">
            <div
              className="bg-debit h-full "
              style={{
                width: `${savingPercentage}%`,
              }}
            />
          </div>
          <div className="inline-block w-full text-right text-muted-foreground text-xs">
            <span className={cx([["text-red-500/70", redFlag]])}>
              {valueToCurrency(card.slider.current)}
            </span>{" "}
            de {valueToCurrency(card.slider.to)}
          </div>
        </div>
      </CardRoot>
    </>
  );
};
