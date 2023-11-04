import { cn } from "@/lib/utils";
import { LocalizedText } from '../../@types/index';
import { useGlobalContext } from '../../contexts/GlobalContext';

interface IProps {
  sectionTitle?: LocalizedText;
  children: React.ReactNode;
  className?: string;
}

export const Section: React.FC<IProps> = ({
  sectionTitle,
  children,
  className = "",
}) => {
  const {currentLanguage} = useGlobalContext()
  return (
    <section className={cn(className)}>
      {sectionTitle && (
        <h4 className="mb-4 text-2xl font-bold">{sectionTitle[currentLanguage]}</h4>
      )}
      <div>{children}</div>
    </section>
  );
};


export const SectionContainer = ({ children }: { children: React.ReactNode }) => {
  return <div className="mx-auto space-y-4">{children}</div>;
}
