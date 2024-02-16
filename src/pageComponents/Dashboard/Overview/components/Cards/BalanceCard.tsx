import { CardRoot } from "./CardRoot";
import { HiCurrencyDollar } from "react-icons/hi";
import { useGlobalDashboardStore } from "@/contexts/GlobalDashboardStore";
import { valueToCurrency } from "@/utils/misc";

type BalanceCardProps = {};

export const BalanceCard = (card: BalanceCardProps) => {
  const { currentBankAccount } = useGlobalDashboardStore();

  const amount = currentBankAccount?.balance || 0;

  return (
    <>
      <CardRoot
        Icon={HiCurrencyDollar}
        title={{
          pt: "Saldo Total",
          en: "Total Balance",
        }}
      >
        {<h4 className="text-2xl font-bold">{valueToCurrency(amount)}</h4>}
      </CardRoot>
    </>
  );
};
