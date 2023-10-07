import Header from "./Header";
import { ReactNode } from "react";
import { DashboardMenu } from "./DashboardMenu";

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  return (
    <div className="relative flex flex-col min-h-[100vh]">
      <div className="flex-1 flex">
        <DashboardMenu />
        <div className="flex flex-col flex-1 px-8">
          <Header />
          <div className="flex-1">
            <main className="">{children}</main>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
