import { CardRoot } from "./CardRoot";
import { HiCurrencyDollar } from "react-icons/hi";
import { useGlobalDashboardStore } from "@/contexts/GlobalDashboardStore";
import { valueToCurrency } from "@/utils/misc";

type BalanceCardProps = {
  balance: number
};

export const BalanceCard = ({balance}: BalanceCardProps) => {

  return (
    <>
      <CardRoot
        Icon={HiCurrencyDollar}
        title={{
          pt: "Saldo Total",
          en: "Total Balance",
        }}
      >
        {<h4 className="text-2xl font-bold">{valueToCurrency(balance)}</h4>}
      </CardRoot>
    </>
  );
};
