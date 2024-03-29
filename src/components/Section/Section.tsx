import { cn } from "@/lib/utils";
import { cx } from "@/utils/misc";
import { LocalizedText } from "../../@types/index";
import { useGlobalContext } from "../../contexts/GlobalContext";
import Link from "next/link";
import { Button } from "../ui/button";
import { ArrowLeftIcon } from "@radix-ui/react-icons";

interface IProps {
  sectionTitle?: LocalizedText;
  children: React.ReactNode;
  className?: string;
  actions?: React.ReactNode;
  rightActions?: React.ReactNode;
  headerBorder?: boolean;
  goBackLink?: string;
}

export const Section: React.FC<IProps> = ({
  sectionTitle,
  children,
  className = "",
  actions,
  rightActions,
  headerBorder = false,
  goBackLink,
}) => {
  const { currentLanguage } = useGlobalContext();
  return (
    <section className={cn('w-full', className)}>
      <header
        className={cx([
          "flex gap-4 items-center mb-4 flex-wrap w-full",
          ["border-b pb-4", headerBorder],
        ])}
      >
        {goBackLink && (
          <Link href={goBackLink}>
            <Button size={"iconLg"} variant={"outline"}>
              <ArrowLeftIcon />
            </Button>
          </Link>
        )}
        {sectionTitle && (
          <h4 className="text-2xl font-bold">
            {sectionTitle[currentLanguage]}
          </h4>
        )}
        <div className="flex items-center gap-2 flex-1">{actions}</div>
        <div className="flex items-center gap-2">{rightActions}</div>
      </header>
      <div>{children}</div>
    </section>
  );
};

export const SectionContainer = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return <div className="mx-auto space-y-4">{children}</div>;
};
