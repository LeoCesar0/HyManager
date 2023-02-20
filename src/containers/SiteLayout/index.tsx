import { ReactNode } from "react";
import Header from "../../components/Header";

interface SiteLayoutProps {
  children: ReactNode;
}

const SiteLayout: React.FC<SiteLayoutProps> = ({ children }) => {
  return (
    <div className="relative flex flex-col min-h-[100vh]" id="app">
      <Header />
      <div className="flex-1">{children}</div>
      {/* {footer && <Footer />} */}
    </div>
  );
};

export default SiteLayout;
