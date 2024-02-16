import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cx } from "@/utils/misc";
import { AppIcon, LocalizedText } from "@/@types";
import { useGlobalContext } from "@/contexts/GlobalContext";

export type CardRootProps = {
  Icon: AppIcon;
  title: LocalizedText;
  strong?: LocalizedText;
  children: React.ReactNode
  className?: string
};

export const CardRoot = ({children, className, ...card}: CardRootProps) => {
  const { currentLanguage } = useGlobalContext();

  return (
    <>
      <Card
        className={cx([
          "min-w-[300px] flex flex-col justify-between",
          className
        ])}
      >
        <CardHeader className="flex flex-row justify-between items-center pb-2">
          <CardTitle className="text-sm font-medium tracking-tight">
            {card.title[currentLanguage]} {card.strong && <strong className="font-bold text-xs text-muted-foreground tracking-tighter" >{card.strong[currentLanguage]}</strong>}
          </CardTitle>
          <card.Icon className="w-6 h-6" />
        </CardHeader>
        <CardContent className="">
          {children}
        </CardContent>
      </Card>
    </>
  );
};
