import { Section, SectionContainer } from "@/components/Section/Section";
import { useGlobalContext } from "@/contexts/GlobalContext";
import { useGlobalDashboardStore } from "@/contexts/GlobalDashboardStore";
import { useToastPromise } from "@/hooks/useToastPromise";
import {
  createBankAccountSchema,
  createBankAccountSchemaPT,
} from "@/server/models/BankAccount/schema";
import selectT from "@/utils/selectT";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

export const BankCategories = () => {
  const { currentBankAccount } = useGlobalDashboardStore();

  const { currentLanguage } = useGlobalContext();

  const { handleToast, isLoading } = useToastPromise();

  const formSchema = useMemo(() => {
    return selectT(currentLanguage, {
      en: createBankAccountSchema,
      pt: createBankAccountSchemaPT,
    });
  }, [currentLanguage]);

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

  async function onSubmit(values: z.infer<typeof formSchema>) {}

  return (
    <>
      <div></div>
    </>
  );
};
