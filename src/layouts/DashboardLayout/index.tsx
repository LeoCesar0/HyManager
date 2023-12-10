import Header from "./Header";
import { ReactNode } from "react";
import { DashboardMenu } from "./DashboardMenu";
import { useGlobalDashboardStore } from "../../contexts/GlobalDashboardStore";
import { If, Then } from "react-if";
import { COLORS } from "@/static/appConfig";

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { currentBankAccount } = useGlobalDashboardStore();

  return (
    <>
      {/* <div className="relative flex flex-col min-h-[100vh]">
        <div className="flex-1 flex">
          <DashboardMenu />
          <div className="flex flex-col flex-1 px-8">
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
      </div> */}
      <div className="relative flex flex-col min-h-[100vh]">
        <div className="">
          {/* DASHBOARD MENU */}
          <DashboardMenu />
          {/* DASHBOARD CONTAINER */}
          <div className="flex flex-col flex-1 px-8">
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
      </div>
    </>
  );
};

export default DashboardLayout;
