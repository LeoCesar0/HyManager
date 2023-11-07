import { Section, SectionContainer } from "@/components/Section/Section";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  createTransactionSchema,
  TransactionType,
} from "@/server/models/Transaction/schema";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useGlobalDashboardStore } from "@/contexts/GlobalDashboardStore";
import Button from "@/components/Button";
import { Input } from "@/components/ui/input";

const formSchema = createTransactionSchema;

export const DashboardTransactionsAdd = () => {
  const { currentBankAccount } = useGlobalDashboardStore();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: 0,
      bankAccountId: currentBankAccount!.id,
      date: "",
      creditor: "",
      type: TransactionType.debit,
      description: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }

  return (
    <>
      <SectionContainer>
        <Section
          sectionTitle={{
            pt: "Nova transação",
            en: "New Transaction",
          }}
          className="max-w-[600px]"
        >
          <>
            <FormProvider {...form}>
              <Form onSubmit={form.handleSubmit(onSubmit)}  >
                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Amount</FormLabel>
                      <FormControl>
                        <Input placeholder="100,00" {...field} />
                      </FormControl>
                      <FormDescription>
                        This is your public display name.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit">Submit</Button>
              </Form>
            </FormProvider>
          </>
        </Section>
      </SectionContainer>
    </>
  );
};
