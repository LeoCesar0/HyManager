import { ButtonHTMLAttributes } from "react";
import { cx } from "../../utils/misc";

interface IButton extends ButtonHTMLAttributes<HTMLButtonElement> {
  theme?: "default" | "primary" | "secondary";
  classes?: string;
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
}

const IconButton: React.FC<IButton> = ({
  theme = "default",
  classes = "",
  size = "md",
  children,
  ...rest
}) => {
  return (
    <>
      <button
        className={cx([
          "transition  rounded-full",
          ["px-1 py-1 text-sm", size === "sm"],
          ["px-2 py-2 text-base", size === "md"],
          ["px-3 py-3 text-lg", size === "lg"],
          [
            "text-on-primary bg-zinc-800 hover:bg-zinc-900",
            theme === "default",
          ],
          [
            "text-on-primary bg-primary hover:bg-primary-hover",
            theme === "primary",
          ],
          [
            "text-on-secondary bg-secondary hover:bg-secondary-hover",
            theme === "secondary",
          ],
          "disabled:bg-disabled disabled:border-disabled-border disabled:text-disabled-text disabled:cursor-not-allowed",
          classes,
        ])}
        {...rest}
      >
        {children}
      </button>
    </>
  );
};

export default IconButton;
