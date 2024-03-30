import { FormFields } from "@/components/FormFields";
import { Section, SectionContainer } from "@/components/Section/Section";
import { Button } from "@/components/ui/button";
import { useGlobalContext } from "@/contexts/GlobalContext";
import { useGlobalDashboardStore } from "@/contexts/GlobalDashboardStore";
import { useToastPromise } from "@/hooks/useToastPromise";
import {
  CreateBankAccount,
  createBankAccountSchema,
  createBankAccountSchemaPT,
} from "@/server/models/BankAccount/schema";
import { updateBankAccount } from "@/server/models/BankAccount/update/updateBankAccount";
import selectT from "@/utils/selectT";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import { useGetFormFields } from "./useGetFormFields";
import { Form } from "@/components/ui/form";
import { imagesToFileInfo } from "@/utils/imagesToFileInfo";

export const GeneralSettings = () => {
  const { currentBankAccount } = useGlobalDashboardStore();

  const { currentLanguage } = useGlobalContext();

  const { handleToast, isLoading } = useToastPromise();

  const formSchema = useMemo(() => {
    return selectT(currentLanguage, {
      en: createBankAccountSchema,
      pt: createBankAccountSchemaPT,
    });
  }, [currentLanguage]);

  const formFields = useGetFormFields(currentLanguage);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      //   categories: currentBankAccount?.categories || [],
      description: currentBankAccount?.description || "",
      image: currentBankAccount?.image || null,
      name: currentBankAccount?.name || "",
      users: currentBankAccount?.users || [],
    },
    mode: "onChange",
    reValidateMode: "onChange",
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const _values = await imagesToFileInfo<CreateBankAccount>({
      formFields: formFields,
      bankAccountId: currentBankAccount!.id,
      formValues: values,
      imageFields: [
        {
          multiple: false,
          name: "image",
        },
      ],
    });

    const promise = updateBankAccount({
      id: currentBankAccount!.id,
      values: {
        ..._values,
      },
    });

    handleToast(promise, {
      defaultErrorMessage: {
        pt: "Erro ao criar transação",
        en: "Error creating transaction",
      },
      loadingMessage: {
        pt: "Adicionando transação",
        en: "Adding transaction",
      },
      successMessage: {
        pt: "Transação adicionada",
        en: "Transaction added",
      },
    });
  }

  return (
    <>
      <FormProvider {...form}>
        <Form onSubmit={form.handleSubmit(onSubmit)}>
          <FormFields form={form} fields={formFields} />
          <Button type="submit" disabled={isLoading || !form.formState.isValid}>
            Submit
          </Button>
        </Form>
      </FormProvider>
    </>
  );
};
