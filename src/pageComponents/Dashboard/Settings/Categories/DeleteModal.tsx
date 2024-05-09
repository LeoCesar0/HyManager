import { Button } from "@/components/ui/button";
import { useGlobalAuth } from "@/contexts/GlobalAuth";
import { useGlobalContext } from "@/contexts/GlobalContext";
import { useGlobalDashboardStore } from "@/contexts/GlobalDashboardStore";
import { useGlobalModal } from "@/contexts/GlobalModal";
import { useToastPromise } from "@/hooks/useToastPromise";
import { BankCategory } from "@/server/models/BankAccount/schema";
import { updateBankAccount } from "@/server/models/BankAccount/update/updateBankAccount";
import selectT from "@/utils/selectT";
import cloneDeep from "lodash.clonedeep";

export const DeleteModal = ({ category }: { category: BankCategory }) => {
  const { currentLanguage } = useGlobalContext();
  const { currentBankAccount, bankAccounts, fetchBankAccounts } =
    useGlobalDashboardStore();
  const { handleToast, isLoading } = useToastPromise();
  const { closeModal } = useGlobalModal();

  const deleteCategory = async () => {
    const bankCategories = cloneDeep(
      currentBankAccount!.categories || []
    ).filter((item) => item.id !== category.id);

    const promise = updateBankAccount({
      id: currentBankAccount!.id,
      values: {
        categories: bankCategories,
      },
    });

    const response = await handleToast(promise, "updateMessages");

    if (response.done && currentBankAccount) {
      const updatedBankAccounts = cloneDeep(bankAccounts);
      const currentUpdatedBank = cloneDeep(currentBankAccount);

      currentUpdatedBank.categories = bankCategories;
      const indexOfBankAccount = updatedBankAccounts.findIndex(
        (item) => item.id === currentUpdatedBank.id
      );
      updatedBankAccounts.splice(indexOfBankAccount, 1, currentUpdatedBank);
      fetchBankAccounts(updatedBankAccounts);
    }
    closeModal();
  };

  return (
    <div>
      <Button
        className="ml-auto"
        onClick={() => {
          deleteCategory();
        }}
      >
        {selectT(currentLanguage, {
          en: "Delete",
          pt: "Deletar",
        })}
      </Button>
    </div>
  );
};
