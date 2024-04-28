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

type IProps = {
  initialValues?: BankCategory;
};

export const CategoryForm = ({ initialValues }: IProps) => {
  const { currentLanguage } = useGlobalContext();
  const { currentBankAccount } = useGlobalDashboardStore();
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
    const bankCategories = currentBankAccount!.categories || [];
    const item: BankCategory = {
      ...values,
      slug: slugify(values.name),
      id: initialValues?.id || uuid(),
      isDefault: false,
    };

    const existingIndex = bankCategories.findIndex(
      (item) => item.slug !== item.slug
    );

    const updatedCategories = [...bankCategories];

    if (existingIndex <= -1) {
      updatedCategories.push(item);
    } else {
      updatedCategories[existingIndex] = item;
    }
    const promise = updateBankAccount({
      id: currentBankAccount!.id,
      values: {
        categories: updatedCategories,
      },
    });

    handleToast(promise, "createMessages");
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
