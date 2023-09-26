import Header from "./Header";
import { ReactNode } from "react";

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  return (
    <div className="relative flex flex-col min-h-[100vh]" id="app">
      <Header />
      <div className="flex-1">{children}</div>
    </div>
  );
};

export default DashboardLayout;
