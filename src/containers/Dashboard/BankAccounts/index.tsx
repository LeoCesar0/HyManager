import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { IoMdAdd } from "react-icons/io";
import Modal from "../../../components/Modal";
import { useGlobalAuth } from "../../../contexts/GlobalAuth";
import { useGlobalModal } from "../../../contexts/GlobalModal";
import {
  useGetUserBankAccountsLazyQuery,
  useGetUserBankAccountsQuery,
} from "../../../graphql/generated";
import BankAccountForm from "./BackAccountForm";

const BankAccounts = () => {
  const { currentUser, userBankAccounts } = useGlobalAuth();

  return (
    <>
      <div className="px-4">
        <h2 className="text-lg">Bank Accounts</h2>
      </div>
      <div className="py-8 flex gap-4">
        <Card isAddMore />
        {userBankAccounts.map((item) => {
          return (
            <Link key={item.id} href={`dashboard/bank/${item.id}`}>
              <Card
                isAddMore={false}
                title={item.title}
                description={item.description || ""}
              />
            </Link>
          );
        })}
      </div>
    </>
  );
};

interface ICard {
  isAddMore?: boolean;
  title?: string;
  description?: string;
}

export default BankAccounts;

const Card = ({ isAddMore = false, title, description }: ICard) => {
  const { setModalProps } = useGlobalModal();
  // const { isOpen: formisOpen } = modalProps;
  return (
    <div
      className="rounded-md cursor-pointer shadow-md aspect-square h-52 bg-on-background text-primary flex-center text"
      onClick={() => {
        if (isAddMore) {
          setModalProps({
            title: "Create new bank account",
            description: "Add a new bank account now!",
            children: <BankAccountForm />,
            isOpen: true,
          });
        }
      }}
    >
      {isAddMore ? (
        <div>
          <IoMdAdd size={64} />
        </div>
      ) : (
        <div>
          <h3>{title}</h3>
          <p>{description}</p>
        </div>
      )}
    </div>
  );
};
