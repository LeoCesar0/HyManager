import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import useT from "@/hooks/useT";
import { useFormatDate } from "@/hooks/useFormatDate";
import { useGlobalContext } from "@/contexts/GlobalContext";

interface IProps {
  date: Date;
  setDate: (date: Date) => void;
}

export const DatePicker = ({ date, setDate }: IProps) => {
  const {currentDateLocale} = useGlobalContext()

  const pickDateText = useT({
    en: "Pick a date",
    pt: "Escolha uma data",
  });

  const dateLabel = useFormatDate(date, 'PPP')

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-[280px] justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {dateLabel ? dateLabel : <span>{pickDateText}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={(value) => {
            if (value) setDate(value);
          }}
          initialFocus
          locale={currentDateLocale}
        />
      </PopoverContent>
    </Popover>
  );
};
