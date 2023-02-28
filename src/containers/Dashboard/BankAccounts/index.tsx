import { useState } from "react";
import { IoMdAdd } from "react-icons/io";
import Modal from "../../../components/Modal";
import { useGlobalModal } from "../../../contexts/GlobalModal";
import BankAccountForm from "./BackAccountForm";

const BankAccounts = () => {
  return (
    <>
      <div className="px-4">
        <h2 className="text-lg">Bank Accounts</h2>
      </div>
      <div className="py-8">
        <Card isAddMore />
      </div>
    </>
  );
};

interface ICard {
  isAddMore: boolean;
}

export default BankAccounts;

const Card = ({ isAddMore }: ICard) => {
    const { modalProps, setModalProps } = useGlobalModal();
    const { isOpen: formisOpen } = modalProps;

    const formTitle = "Create new bank account";

  return (
    <div
      className="rounded-md cursor-pointer shadow-md aspect-square h-40 bg-on-background text-primary flex-center text"
      onClick={() => {
        setModalProps({
          title: formTitle,
          description: "Add a new bank account now!",
          children: <BankAccountForm />,
          isOpen: true,
        });
      }}
    >
      {isAddMore ? (
        <div>
          <IoMdAdd size={64} />
        </div>
      ) : (
        <div>+</div>
      )}
      
    </div>
  );
};


