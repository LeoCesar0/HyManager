import { Section, SectionContainer } from "@/components/Section/Section";
import { Form } from "@/components/ui/form";
import {
  createTransactionSchema,
  TransactionType,
} from "@/server/models/Transaction/schema";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useGlobalDashboardStore } from "@/contexts/GlobalDashboardStore";
import { Button } from "@/components/ui/button";
import { useTranslation } from "next-i18next";
import { makeZodI18nMap } from "zod-i18n-map";
import { FormFields } from "@/components/FormFields";
import { formFields } from "./formFields";
import { createTransaction } from "@/server/models/Transaction/create/createTransaction";
import { useToastPromise } from "@/hooks/useToastPromise";
import { UploadIcon } from "@radix-ui/react-icons";
import useT from "@/hooks/useT";
import Link from "next/link";

const formSchema = createTransactionSchema;

export const DashboardTransactionsAdd = () => {
  const { currentBankAccount } = useGlobalDashboardStore();
  const { t } = useTranslation();

  const { handleToast, isLoading } = useToastPromise();

  z.setErrorMap(makeZodI18nMap({ t }));

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: 0,
      bankAccountId: currentBankAccount!.id,
      date: new Date(),
      creditor: "",
      type: TransactionType.debit,
      description: "",
    },
    mode: "all",
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const promise = createTransaction({
      bankAccountId: currentBankAccount!.id,
      values: {
        ...values,
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
    });
  }

  return (
    <>
      <SectionContainer>
        <Section
          sectionTitle={{
            pt: "Nova transação",
            en: "New Transaction",
          }}
          goBackLink="/dashboard/transactions"
          actions={
            <>
              <Link href={`/dashboard/transactions/import-extract`}>
                <Button disabled={isLoading}
                  variant={'secondary'}
                >
                  <UploadIcon />
                  {useT({
                    en: "Import PDF",
                    pt: "Importar PDF",
                  })}
                </Button>
              </Link>
            </>
          }
        >
          <>
            <FormProvider {...form}>
              <Form onSubmit={form.handleSubmit(onSubmit)}>
                <FormFields form={form} fields={formFields} />
                <Button
                  type="submit"
                  disabled={isLoading || !form.formState.isValid}
                >
                  Submit
                </Button>
              </Form>
            </FormProvider>
          </>
        </Section>
      </SectionContainer>
    </>
  );
};
