import { ReactNode } from "react";
import { cx } from "../../utils/misc";
import styles from "./styles.module.scss";

interface SiteLayoutProps {
  children: ReactNode;
  header?: Boolean;
  footer?: Boolean;
}

const SiteLayout: React.FC<SiteLayoutProps> = ({
  header = true,
  footer = true,
  children,
}) => {
  return (
    <div className="">
      {/* {header && <Header />} */}
      <div className="">{children}</div>
      {/* {footer && <Footer />} */}
    </div>
  );
};

export default SiteLayout;

