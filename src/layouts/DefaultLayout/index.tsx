import Header from "./Header";
import { ReactNode } from "react";

interface DefaultLayoutProps {
  children: ReactNode;
}

const DefaultLayout: React.FC<DefaultLayoutProps> = ({ children }) => {
  return (
    <div className="relative flex flex-col min-h-[100vh]" id="app">
      <Header />
      <div className="flex-1">{children}</div>
    </div>
  );
};

export default DefaultLayout;
