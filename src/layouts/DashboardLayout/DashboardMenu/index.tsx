import AppLogo from "@/components/AppLogo";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGlobalContext } from "@/contexts/GlobalContext";
import { HamburgerMenuIcon } from "@radix-ui/react-icons";
import { DASHBOARD_CONFIG } from "../../../static/dashboardConfig";
import Link from "next/link";
import { cx } from "@/utils/misc";
import { useGlobalDashboardStore } from "@/contexts/GlobalDashboardStore";
import useSwr from "swr";
import {
  ListBankAccountByUserIdReturnType,
  listBankAccountByUserId,
} from "../../../server/models/BankAccount/read/listBankAccountByUserId";
import { useGlobalAuth } from "../../../contexts/GlobalAuth";
import { FirebaseCollection } from "../../../server/firebase/index";
import { useGlobalModal } from "../../../contexts/GlobalModal";
import { CreateBankAccountForm } from "../../../pageComponents/Dashboard/CreateBankAccountForm/index";
import { memo, useMemo } from "react";
import selectT from "@/utils/selectT";

const { menuItems } = DASHBOARD_CONFIG;

const Component = () => {
  const { currentLanguage } = useGlobalContext();
  const { currentUser } = useGlobalAuth();
  const { menuIsOpen, toggleMenu, currentBankAccount, setCurrentBankAccount } =
    useGlobalDashboardStore();
  const { setModalProps } = useGlobalModal();

  const bankAccountsKey = useMemo(() => {
    return currentUser?.id
      ? [FirebaseCollection.bankAccounts, currentUser.id]
      : null;
  }, [currentUser?.id]);

  const bankAccountsFetch = useSwr<
    ListBankAccountByUserIdReturnType,
    any,
    string[] | null
  >(bankAccountsKey, ([_, id]) => {
    return listBankAccountByUserId({ id: id }).then((data) => {
      if (data.data && data.data.length > 0) {
        setCurrentBankAccount(data.data[0]);
      }
      const shouldCreateBankAccount = !data.data || data.data.length > 0;

      if (!shouldCreateBankAccount) {
        setModalProps({
          isOpen: true,
          children: <CreateBankAccountForm />,
          title: "Create Bank Account",
          autoToggle: false,
        });
      }

      return data;
    });
  });

  const bankAccounts = bankAccountsFetch.data?.data ?? [];

  return (
    <>
      <aside
        className={cx([
          "hidden md:block fixed left-0 top-0 bottom-0 z-10",
          "max-w-[var(--menu-width)] w-full min-h-screen border-r shadow-2xl border-border/25 bg-surface text-surface-foreground space-y-4",
          `p-4`,
          "transition-all translate-x-0",
          [
            `translate-x-[calc(-100%+var(--menu-closed-width))] mr-[calc(-var(--menu-width)+var(--menu-closed-width))] px-0`,
            !menuIsOpen,
          ],
        ])}
      >
        <div className="flex justify-between items-center">
          <AppLogo />
          <Button
            size={"icon"}
            className={cx([
              `w-[calc(var(--menu-closed-width)-2*1rem)] h-[calc(var(--menu-closed-width)-2*1rem)]`,
              ["mr-4", !menuIsOpen],
            ])}
            variant="outline"
            onClick={toggleMenu}
          >
            <HamburgerMenuIcon />
          </Button>
        </div>
        <div className="!mb-8">
          <Label>Bank Account</Label>
          <Select
            value={currentBankAccount?.id ?? ""}
            onValueChange={(value) => {
              const bankAccount = bankAccounts.find(
                (item) => item.id === value
              );
              setCurrentBankAccount(bankAccount ?? null);
            }}
          >
            <SelectTrigger
              className={cx(["transition-all", ["hidden", !menuIsOpen]])}
            >
              <SelectValue
                placeholder={selectT(currentLanguage, {
                  pt: "Selecione um banco",
                  en: "Select a bank",
                })}
              />
            </SelectTrigger>
            <SelectContent>
              {bankAccounts.map((item) => {
                return (
                  <SelectItem
                    key={item.id}
                    value={item.id}
                    onClick={() => {
                      setCurrentBankAccount(item);
                    }}
                  >
                    {item.name}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>
        <ul className="rounded-md overflow-hidden">
          {menuItems.map((item, index) => {
            return (
              <Link key={item.link} href={item.link}>
                <li
                  className={cx([
                    "py-4 px-4 shadow-inner bg-surface/25 hover:bg-accent transition-colors overflow-hidden",
                    "flex items-center gap-2",
                    ["border-t", index !== 0],
                    ["justify-center px-0 w-[4rem] ml-auto", !menuIsOpen],
                  ])}
                >
                  <item.icon
                    className={cx([`w-4 h-4`, ["w-6 h-6", !menuIsOpen]])}
                  />
                  {menuIsOpen && item.label[currentLanguage]}
                </li>
              </Link>
            );
          })}
        </ul>
      </aside>
    </>
  );
};

export const DashboardMenu = memo(Component);
