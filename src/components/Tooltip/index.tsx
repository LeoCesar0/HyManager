import { useRef } from "react";
import styles from "./styles.module.scss";

type Props = {
  children: React.ReactNode;
};

export const Tooltip: React.FC<Props> = ({ children }) => {
  const ref = useRef(null);

  return (
    <>
      <span className={styles.root}>
        <span className={styles.trigger}>{children}</span>
        <span className={styles.content}>{children}</span>
      </span>
    </>
  );
};
