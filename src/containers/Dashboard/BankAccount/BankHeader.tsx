import { useRouter } from "next/router";
import { BankAccount } from "@types-folder/models/BankAccount";
import Button from "@components/Button";
import { useGlobalModal } from "@contexts/GlobalModal";
import IconButton from "@components/IconButton";
import { HiArrowLeft } from "react-icons/hi";
import TransactionForm from "./TransactionForm";

interface IBankHeader {
  currentBank: BankAccount | null;
}

const BankHeader: React.FC<IBankHeader> = ({ currentBank }) => {
  const router = useRouter();
  const { setModalProps } = useGlobalModal();

  return (
    <div className="border-b-primary border-b-2 py-2 mb-8 flex justify-between">
      <div className="flex gap-1 items-end">
        <IconButton classes="mr-4">
          <HiArrowLeft />
        </IconButton>
        <h1 className="text-2xl mr-6">{currentBank?.title}</h1>
        <span>
          Balance{" "}
          {currentBank?.balance.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          })}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <Button
          theme="primary"
          onClick={() => {
            setModalProps({
              isOpen: true,
              children: <TransactionForm />,
              title: "Add new Transaction",
            });
          }}
        >
          New Transaction
        </Button>
        <Button theme="secondary">Transactions</Button>
      </div>
    </div>
  );
};

export default BankHeader;
