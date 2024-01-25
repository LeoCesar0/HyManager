import clsx from "clsx";
import { SetFieldValue } from "react-hook-form";
import { useGlobalContext } from "../../contexts/GlobalContext";
import { TransactionType } from "../../server/models/Transaction/schema";

interface IProps {
  setValue: SetFieldValue<any>;
  fieldName: string;
  currentValue: string;
}

const commonClassName =
  "p-2 flex-1 flex-center cursor-pointer transition-opacity";

export const TransactionTypeRadio: React.FC<IProps> = ({
  setValue,
  fieldName,
  currentValue,
}) => {
  const { currentLanguage } = useGlobalContext();

  return (
    <div className="px-2 max-w-[200px] flex items-center justify-center">
      <div
        className={clsx([
          "bg-debit rounded-l-sm",
          commonClassName,
          [currentValue !== TransactionType.debit && "opacity-50"],
        ])}
        onClick={() => {
          setValue(fieldName, TransactionType.debit);
        }}
      >
        {
          {
            en: "Debit",
            pt: "Débito",
          }[currentLanguage]
        }
      </div>
      <div
        className={clsx("bg-deposit rounded-r-sm", commonClassName, [
          currentValue !== TransactionType.deposit && "opacity-50",
        ])}
        onClick={() => {
          setValue(fieldName, TransactionType.deposit);
        }}
      >
        {
          {
            en: "Deposit",
            pt: "Depósito",
          }[currentLanguage]
        }
      </div>
    </div>
  );
};
