import { cn } from "@/lib/utils";
import { cx } from "@/utils/misc";
import { LocalizedText } from "../../@types/index";
import { useGlobalContext } from "../../contexts/GlobalContext";
import Link from "next/link";
import { Button } from "../ui/button";
import { ArrowLeftIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/router";

interface IProps {
  sectionTitle?: LocalizedText;
  sectionSubTitle?: LocalizedText;
  children: React.ReactNode;
  className?: string;
  actions?: React.ReactNode;
  rightActions?: React.ReactNode;
  headerBorder?: boolean;
  goBackLink?: string | true;
}

export const Section: React.FC<IProps> = ({
  sectionTitle,
  sectionSubTitle,
  children,
  className = "",
  actions,
  rightActions,
  headerBorder = false,
  goBackLink,
}) => {
  const { currentLanguage } = useGlobalContext();
  const router = useRouter();
  return (
    <section className={cn("w-full", className)}>
      <header
        className={cx([
          "flex gap-4 items-center mb-4 flex-wrap w-full",
          ["border-b pb-4", headerBorder],
        ])}
      >
        {goBackLink && typeof goBackLink === "string" && (
          <Link href={goBackLink}>
            <BackButton />
          </Link>
        )}
        {goBackLink === true && (
          <BackButton
            onClick={() => {
              if (goBackLink === true) {
                router.back();
              }
            }}
          />
        )}
        {sectionTitle && (
          <h3 className="text-2xl font-bold">
            {sectionTitle[currentLanguage]}
          </h3>
        )}
        {sectionSubTitle && (
          <h4 className="text-lg font-bold">
            {sectionSubTitle[currentLanguage]}
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

const BackButton = ({ ...rest }) => {
  return (
    <Button size={"iconLg"} variant={"outline"} {...rest}>
      <ArrowLeftIcon />
    </Button>
  );
};
