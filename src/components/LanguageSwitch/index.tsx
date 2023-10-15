import { Locale } from "@/@types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useGlobalContext } from "../../contexts/GlobalContext";

interface IProps {}

export const LanguageSwitch: React.FC<IProps> = ({}) => {
  const { currentLanguage, setLanguage } = useGlobalContext();
  return (
    <>
      <Select
        onValueChange={(value) => setLanguage(value as Locale)}
        value={currentLanguage}
      >
        <SelectTrigger className="text-sm font-semibold uppercase w-min ">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {Object.values(Locale).map((locale) => {
            return (
              <SelectItem className="uppercase" key={locale} value={locale}>
                {locale}
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
    </>
  );
};
