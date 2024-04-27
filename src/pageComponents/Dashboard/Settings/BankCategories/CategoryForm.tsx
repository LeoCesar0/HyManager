import { FormFields } from "@/components/FormFields";
import { Button } from "@/components/ui/button";
import { useGlobalContext } from "@/contexts/GlobalContext";
import { useGlobalDashboardStore } from "@/contexts/GlobalDashboardStore";
import { useToastPromise } from "@/hooks/useToastPromise";
import {
  BankCategory,
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

export const CategoryForm = () => {
  const { currentBankAccount } = useGlobalDashboardStore();
  const { currentLanguage } = useGlobalContext();

  const { handleToast, isLoading } = useToastPromise();

  const formSchema = useMemo(() => {
    return selectT(currentLanguage, {
      en: createBankCategorySchema,
      pt: createBankCategorySchemaPT,
    });
  }, [currentLanguage]);

  const defaultValues: BankCategory = {
    color: "",
    isDefault: false,
    name: "",
    slug: "",
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues,
    mode: "onChange",
    reValidateMode: "onChange",
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {}

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
