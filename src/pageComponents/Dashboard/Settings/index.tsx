import { Section, SectionContainer } from "@/components/Section/Section";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GeneralSettings } from "./GeneralSettings";
import { useGlobalContext } from "@/contexts/GlobalContext";
import selectT from "@/utils/selectT";
import { BankCategories } from "./BankCategories";

export const DashboardSettings = () => {
  const { currentLanguage } = useGlobalContext();

  return (
    <SectionContainer>
      <Tabs defaultValue="general" className="w-[400px]">
        <Section
          sectionTitle={{
            pt: "Configurações",
            en: "Settings",
          }}
        >
          <TabsList>
            {tabs.map((item) => (
              <TabsTrigger key={item.tabValue} value={item.tabValue}>
                {selectT(currentLanguage, item.tabLabel)}
              </TabsTrigger>
            ))}
          </TabsList>
        </Section>
        <Section>
          {tabs.map((item) => (
            <TabsContent key={item.tabValue} value={item.tabValue}>
              {<item.component />}
            </TabsContent>
          ))}
        </Section>
      </Tabs>
    </SectionContainer>
  );
};

const tabs = [
  {
    tabValue: "general",
    tabLabel: {
      en: "Bank",
      pt: "Banco",
    },
    component: GeneralSettings,
  },
  {
    tabValue: "categories",
    tabLabel: {
      en: "Categories",
      pt: "Categorias",
    },
    component: BankCategories,
  },
];
