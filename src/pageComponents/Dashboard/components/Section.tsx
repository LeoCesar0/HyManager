import { cn } from "@/lib/utils";

interface IProps {
  sectionTitle?: string;
  children: React.ReactNode;
  className?: string;
}

export const Section: React.FC<IProps> = ({
  sectionTitle,
  children,
  className = "",
}) => {
  return (
    <section className={cn(className)}>
      {sectionTitle && <h4 className="mb-4 text-2xl font-bold">{sectionTitle}</h4>}
      <div>{children}</div>
    </section>
  );
};
