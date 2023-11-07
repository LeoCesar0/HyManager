import Link from "next/link";
import { ButtonHTMLAttributes } from "react";
import { cx } from "../../utils/misc";

interface IButton extends ButtonHTMLAttributes<HTMLButtonElement> {
  theme?: "primary" | "secondary";
  classes?: string;
  size?: "sm" | "md" | "lg";
  selected?: boolean;
  href?: string;
}

const Button: React.FC<IButton> = ({
  theme = "primary",
  classes = "",
  size = "md",
  children,
  type = "button",
  selected,
  href,
  ...rest
}) => {
  const bgColorSelected = `bg-blue-500`;
  const textColor = `text-on-${theme}`;

  const Root = () => (
    <button
      className={cx([
        "transition  rounded-md",
        ["px-2 py-1 text-sm", size === "sm"],
        ["px-3 py-1 text-base", size === "md"],
        ["px-4 py-2 text-lg", size === "lg"],
        `${textColor} bg-${theme} hover:bg-${theme}-hover`,
        [`drop-shadow-md ${bgColorSelected}`, !!selected],
        "disabled:bg-disabled disabled:border-disabled-border disabled:text-disabled-text disabled:cursor-not-allowed",
        classes,
      ])}
      {...rest}
    >
      {children}
    </button>
  );

  return (
    <>
      {href ? (
        <>
          <Link className="block" href={href}>
            <Root />
          </Link>
        </>
      ) : (
        <Root />
      )}
    </>
  );
};

export default Button;
