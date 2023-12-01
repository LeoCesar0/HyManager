import { cn } from "@/lib/utils";
import { cx } from "@/utils/misc";
import { LocalizedText } from "../../@types/index";
import { useGlobalContext } from "../../contexts/GlobalContext";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface IProps {
  sectionTitle?: LocalizedText;
  children: React.ReactNode;
  className?: string;
  actions?: React.ReactNode;
  headerBorder?: boolean;
  goBackLink?: string;
}

export const Section: React.FC<IProps> = ({
  sectionTitle,
  children,
  className = "",
  actions,
  headerBorder = false,
  goBackLink,
}) => {
  const { currentLanguage } = useGlobalContext();
  return (
    <section className={cn(className)}>
      <header
        className={cx([
          "flex gap-4 items-center mb-4 ",
          ["border-b pb-4", headerBorder],
        ])}
      >
        {goBackLink && (
          <Link href={goBackLink}>
            {/* <Button>
              <ArrowLeft />
            </Button> */}
            {/* <IconButton>
              <ArrowLeft />
            </IconButton> */}
          </Link>
        )}
        {sectionTitle && (
          <h4 className="text-2xl font-bold">
            {sectionTitle[currentLanguage]}
          </h4>
        )}
        <div className="flex items-center gap-2">{actions}</div>
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
