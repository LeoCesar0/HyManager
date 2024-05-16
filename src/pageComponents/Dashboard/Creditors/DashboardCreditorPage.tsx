import { Section, SectionContainer } from "@/components/Section/Section";
import { SimpleTableCell } from "@/components/SimpleTable/SimpleTableCell";
import { SimpleTableRow } from "@/components/SimpleTable/SimpleTableRow";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGlobalContext } from "@/contexts/GlobalContext";
import { useGlobalDashboardStore } from "@/contexts/GlobalDashboardStore";
import useT from "@/hooks/useT";
import { getBankCreditor } from "@/server/models/BankCreditor/read/getBankCreditor";
import { BankCreditor } from "@/server/models/BankCreditor/schema";
import { listTransactionsByBankId } from "@/server/models/Transaction/read/listTransactionsByBankId";
import { Transaction } from "@/server/models/Transaction/schema";
import { formatAnyDate } from "@/utils/date/formatAnyDate";
import { valueToCurrency } from "@/utils/misc";
import selectT from "@/utils/selectT";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import { If, Then } from "react-if";
import { CategorySelect } from "../components/CategorySelect";
import { Button } from "@/components/ui/button";
import { useToastPromise } from "@/hooks/useToastPromise";
import { updateBankCreditor } from "@/server/models/BankCreditor/update/updateBankCreditor";

export const DashboardCreditorPage = () => {
  const { currentBankAccount } = useGlobalDashboardStore();
  const { currentLanguage } = useGlobalContext();
  const [transactionsByMonth, setTransactionsByMonth] = useState<
    Map<string, Transaction[]>
  >(new Map());
  const [creditor, setCreditor] = useState<BankCreditor | null>(null);
  const [changingCategory, setChangingCategory] = useState(false);
  const router = useRouter();

  const creditorSlug = (router.query.slug || "") as string;

  const { handleToast, isLoading } = useToastPromise();

  useEffect(() => {
    if (currentBankAccount && creditorSlug) {
      getBankCreditor({
        bankAccountId: currentBankAccount?.id || "",
        creditorSlug: creditorSlug,
      }).then((res) => {
        setCreditor(res.data);
      });
    }
  }, [currentBankAccount, creditorSlug]);

  useEffect(() => {
    if (currentBankAccount && creditorSlug) {
      listTransactionsByBankId({
        id: currentBankAccount.id,
        filters: [
          {
            field: "creditorSlug",
            operator: "==",
            value: creditorSlug,
          },
        ],
        pagination: {
          limit: 99999999,
          page: 1,
          orderBy: {
            field: "date",
            direction: "desc",
          },
        },
      }).then((res) => {
        if (res.data) {
          // setTransactions(res.data.list);
          const transByMonth = new Map<string, Transaction[]>();
          res.data.list.forEach((transaction) => {
            const month = formatAnyDate(transaction.date, "MM/yyyy");
            if (!transByMonth.has(month)) {
              transByMonth.set(month, []);
            }
            transByMonth.get(month)?.push(transaction);
          });
          setTransactionsByMonth(transByMonth);
        }
      });
    }
  }, [currentBankAccount, creditorSlug]);

  const { debitAmount, depositAmount, totalAmount } = useMemo(() => {
    const allTransactions = Array.from(transactionsByMonth.values()).flat();
    return allTransactions.reduce(
      (acc, transaction) => {
        if (transaction.amount <= 0) {
          acc.debitAmount += transaction.amount;
        }
        if (transaction.amount >= 0) {
          acc.depositAmount += transaction.amount;
        }
        acc.totalAmount += transaction.amount;
        return acc;
      },
      {
        debitAmount: 0,
        depositAmount: 0,
        totalAmount: 0,
      }
    );
  }, [transactionsByMonth]);

  const saveCategory = async (newCategoryId: string) => {
    if (!creditor) {
      return;
    }

    const promise = updateBankCreditor({
      id: creditor?.id,
      values: {
        categoryId: newCategoryId,
      },
    });

    const res = await handleToast(promise, "updateMessages");
    if (res.done) {
      setCreditor({
        ...creditor,
        categoryId: newCategoryId,
      });
    }
    setChangingCategory(false);
  };

  return (
    <SectionContainer>
      <Section
        sectionTitle={{
          en: creditor?.creditor ?? "Beneficiary",
          pt: creditor?.creditor ?? "Beneficiário",
        }}
        goBackLink={true}
        rightActions={
          <>
            <div className="flex items-end gap-2">
              <Button
                variant={changingCategory ? "default" : "secondary"}
                onClick={() => {
                  setChangingCategory(!changingCategory);
                }}
                disabled={isLoading}
              >
                {changingCategory
                  ? selectT(currentLanguage, {
                      en: "Cancel",
                      pt: "Cancelar",
                    })
                  : selectT(currentLanguage, {
                      en: "Change",
                      pt: "Mudar",
                    })}
              </Button>
              <CategorySelect
                disabled={!changingCategory || isLoading}
                value={creditor?.categoryId ?? ""}
                onChange={saveCategory}
              />
            </div>
          </>
        }
      >
        <div className="grid grid-cols-1 gap-6 py-6">
          <If condition={!!creditor}>
            <Then>
              <div className="grid grid-cols-[minmax(100px,200px)_1fr]">
                <div className="border-border border-r grid grid-cols-1 gap-2 [&>*]:text-muted-foreground [&>*]:text-sm">
                  <p>
                    {selectT(currentLanguage, {
                      en: "Total debits",
                      pt: "Débitos total",
                    })}
                  </p>
                  <p>
                    {selectT(currentLanguage, {
                      en: "Total deposits",
                      pt: "Depósitos total",
                    })}
                  </p>
                  <p>
                    {selectT(currentLanguage, {
                      en: "Total deposits",
                      pt: "Depósitos total",
                    })}
                  </p>
                </div>
                <div className="px-4 grid grid-cols-1 gap-2">
                  <p>{valueToCurrency(debitAmount)}</p>
                  <p>{valueToCurrency(depositAmount)}</p>
                  <p>{valueToCurrency(totalAmount)}</p>
                </div>
              </div>
            </Then>
          </If>
          <div className="grid grid-cols-1 gap-4">
            {Array.from(transactionsByMonth.entries()).map(
              ([month, transactions]) => {
                return (
                  <div key={month} className="grid grid-cols-1 gap-4">
                    <p>{month}</p>
                    {transactions?.map((transaction) => {
                      return (
                        <SimpleTableRow key={transaction.id}>
                          <SimpleTableCell transactionType={transaction.type}>
                            {valueToCurrency(Math.abs(transaction.amount))}
                          </SimpleTableCell>
                          <SimpleTableCell
                            label={selectT(currentLanguage, {
                              en: "Date",
                              pt: "Data",
                            })}
                          >
                            {formatAnyDate(transaction.date)}
                          </SimpleTableCell>
                          <SimpleTableCell
                            label={selectT(currentLanguage, {
                              en: "Balance after",
                              pt: "Saldo após",
                            })}
                            width={350}
                          >
                            {valueToCurrency(transaction.updatedBalance)}
                          </SimpleTableCell>
                        </SimpleTableRow>
                      );
                    })}
                  </div>
                );
              }
            )}
          </div>
        </div>
      </Section>
    </SectionContainer>
  );
};
