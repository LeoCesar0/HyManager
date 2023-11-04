import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cx, valueToCurrency } from "../../../../../utils/misc";
import { AppIcon, LocalizedText } from "@/@types";
import { useGlobalContext } from "@/contexts/GlobalContext";
import { Slider } from "@/components/ui/slider";
import currency from "currency.js";

export type IOverviewCard = {
  id: string;
  Icon: AppIcon;
  title: LocalizedText;
  strong?: LocalizedText;
  value?: string;
  values?: {
    value: string;
    title: LocalizedText;
  }[];
  slider?: {
    from: number;
    current: number;
    to: number;
  };
};

export const OverviewCard = (card: IOverviewCard) => {
  const { currentLanguage } = useGlobalContext();

  const savingPercentage = card.slider
    ? (card.slider.current / card.slider.to) * 100
    : null;
  const redFlag = savingPercentage ? savingPercentage > 90 : false;

  return (
    <>
      <Card
        className={cx([
          "min-w-[300px] flex flex-col justify-between",
          [
            "bg-gradient-to-r from-card from-25% to-debit",
            card.id === "expenses",
          ],
        ])}
      >
        <CardHeader className="flex flex-row justify-between items-center pb-2">
          <CardTitle className="text-sm font-medium tracking-tight">
            {card.title[currentLanguage]} {card.strong && <strong className="font-bold text-xs text-muted-foreground tracking-tighter" >{card.strong[currentLanguage]}</strong>}
          </CardTitle>
          <card.Icon className="w-6 h-6" />
        </CardHeader>
        <CardContent className="">
          {card.value && <h4 className="text-2xl font-bold">{card.value}</h4>}
          {card.values && (
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
          )}
          {card.slider && (
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
          )}
        </CardContent>
      </Card>
    </>
  );
};
