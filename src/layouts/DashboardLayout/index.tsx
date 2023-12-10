import Header from "./Header";
import { ReactNode } from "react";
import { DashboardMenu } from "./DashboardMenu";
import { useGlobalDashboardStore } from "../../contexts/GlobalDashboardStore";
import { If, Then } from "react-if";
import { COLORS } from "@/static/appConfig";
import { cx } from "../../utils/misc";

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { currentBankAccount, menuIsOpen } = useGlobalDashboardStore();

  return (
    <>
      <div className="relative flex flex-col min-h-[100vh]">
        {/* DASHBOARD MENU */}
        <DashboardMenu />
        {/* DASHBOARD CONTAINER */}
        <div
          className={cx([
            "flex flex-col flex-1 px-8 transition-all md:ml-[var(--menu-width)]",
            ["md:ml-[var(--menu-closed-width)]", !menuIsOpen],
            "",
          ])}
        >
          <Header />
          <div className="flex-1">
            <If condition={!!currentBankAccount}>
              <Then>
                <main className="py-4">{children}</main>
              </Then>
            </If>
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardLayout;
