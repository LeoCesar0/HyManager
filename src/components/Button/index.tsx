import { ButtonHTMLAttributes } from "react";
import { cx } from "../../utils/misc";

interface IButton extends ButtonHTMLAttributes<HTMLButtonElement> {
  theme?: "primary" | "secondary";
  classes?: string;
  size?: "sm" | "md" | "lg";
  selected?: boolean;
}

const Button: React.FC<IButton> = ({
  theme = "primary",
  classes = "",
  size = "md",
  children,
  type = "button",
  selected,
  ...rest
}) => {
  if(selected) console.log('IS SELECTED')

  return (
    <>
      <button
        className={cx([
          "transition  rounded-md",
          ["px-2 py-1 text-sm", size === "sm"],
          ["px-3 py-1 text-base", size === "md"],
          ["px-4 py-2 text-lg", size === "lg"],
          `text-on-${theme} bg-${theme} hover:bg-${theme}-hover`,
          [`bg-${theme}-hover`, !!selected],
          // [`bg-red-500`, !!selected],
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

export default Button;
