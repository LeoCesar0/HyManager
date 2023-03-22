import { BankAccount } from "@types-folder/models/BankAccount";
import Button from "@components/Button";
import { useGlobalModal } from "@contexts/GlobalModal";
import IconButton from "@components/IconButton";
import { HiArrowLeft, HiDotsVertical } from "react-icons/hi";
import TransactionForm from "./TransactionForm";
import { useRouter } from "next/router";
import Dropdown, { IDropdown } from "@components/Dropdown";
import { useMemo } from "react";

interface IBankHeader {
  currentBank: BankAccount | null;
}

const BankHeader: React.FC<IBankHeader> = ({ currentBank }) => {
  const { setModalProps } = useGlobalModal();
  const router = useRouter();

  const dropDownItems: IDropdown["items"] = useMemo(() => {
    return [
      {
        label: "New Transaction",
        onClick: () => {},
      },
      {
        label: "All Transactions",
        onClick: () => {},
      },
      {
        label: "Import CSV",
        onClick: () => {},
      },
    ];
  }, []);

  return (
    <div className="border-b-primary border-b-2 py-2 mb-8 flex justify-between">
      <div className="flex gap-1 items-end">
        <IconButton
          classes="mr-4"
          onClick={() => {
            router.back();
          }}
        >
          <HiArrowLeft />
        </IconButton>
        <h1 className="text-2xl mr-6">{currentBank?.title || ""}</h1>
        <span>
          Balance{" "}
          {currentBank
            ? currentBank.balance.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })
            : ""}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <Button theme="secondary">Transactions</Button>

        <Button
          theme="primary"
          onClick={() => {
            setModalProps({
              isOpen: true,
              children: (
                <TransactionForm bankAccountId={currentBank?.id || ""} />
              ),
            });
          }}
        >
          New Transaction
        </Button>
        <Dropdown items={dropDownItems}>
          <IconButton>
            <HiDotsVertical />
          </IconButton>
        </Dropdown>
        {/* <IconButton

        >
          <HiDotsVertical />
        </IconButton> */}
      </div>
    </div>
  );
};

export default BankHeader;
