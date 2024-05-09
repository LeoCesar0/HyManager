import { FormFields } from "@/components/FormFields";
import { Button } from "@/components/ui/button";
import { useGlobalContext } from "@/contexts/GlobalContext";
import { useGlobalDashboardStore } from "@/contexts/GlobalDashboardStore";
import { useToastPromise } from "@/hooks/useToastPromise";
import {
  BankCategory,
  CreateBankCategory,
  createBankCategorySchema,
  createBankCategorySchemaPT,
} from "@/server/models/BankAccount/schema";
import selectT from "@/utils/selectT";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import { Form } from "@/components/ui/form";
import { useGetFormFields } from "./useGetFormFields";
import { slugify } from "@/utils/app";
import { updateBankAccount } from "@/server/models/BankAccount/update/updateBankAccount";
import { v4 as uuid } from "uuid";
import cloneDeep from "lodash.clonedeep";
import { useGlobalAuth } from "@/contexts/GlobalAuth";

type IProps = {
  initialValues?: BankCategory;
  closeForm: () => void;
};

export const CategoryForm = ({ initialValues, closeForm }: IProps) => {
  const { currentLanguage } = useGlobalContext();
  const { currentUser } = useGlobalAuth();
  const { currentBankAccount, fetchBankAccounts, bankAccounts } =
    useGlobalDashboardStore();
  const { handleToast, isLoading } = useToastPromise();

  const isCreating = !initialValues;

  const formSchema = useMemo(() => {
    return selectT(currentLanguage, {
      en: createBankCategorySchema,
      pt: createBankCategorySchemaPT,
    });
  }, [currentLanguage]);

  const defaultValues: CreateBankCategory = {
    color: initialValues?.color ?? "#fff",
    name: initialValues?.name ?? "",
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues,
    mode: "onChange",
    reValidateMode: "onChange",
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const bankCategories = cloneDeep(currentBankAccount!.categories || []);
    const category: BankCategory = {
      ...values,
      slug: slugify(values.name),
      id: initialValues?.id || uuid(),
      isDefault: false,
    };

    const existingIndex = bankCategories.findIndex(
      (item) => item.id === category.id
    );

    if (existingIndex <= -1) {
      bankCategories.push(category);
    } else {
      bankCategories.splice(existingIndex, 1, category);
    }

    const promise = updateBankAccount({
      id: currentBankAccount!.id,
      values: {
        categories: bankCategories,
      },
    });

    const response = await handleToast(promise, "createMessages");

    if (response.done && currentBankAccount) {
      const updatedBankAccounts = cloneDeep(bankAccounts);
      const updatedBankAccount = cloneDeep(currentBankAccount);
      updatedBankAccount.categories = bankCategories;
      const indexOfBankAccount = updatedBankAccounts.findIndex(
        (item) => item.id === updatedBankAccount.id
      );
      updatedBankAccounts.splice(indexOfBankAccount, 1, updatedBankAccount);

      fetchBankAccounts(updatedBankAccounts);
      closeForm();
    }
  }

  const formFields = useGetFormFields(currentLanguage);

  const saveText = selectT(currentLanguage, {
    en: "Save",
    pt: "Salvar",
  });

  return (
    <>
      <FormProvider {...form}>
        <Form onSubmit={form.handleSubmit(onSubmit)}>
          <FormFields form={form} fields={formFields} />
          <Button type="submit" disabled={isLoading || !form.formState.isValid}>
            {saveText}
          </Button>
        </Form>
      </FormProvider>
    </>
  );
};
