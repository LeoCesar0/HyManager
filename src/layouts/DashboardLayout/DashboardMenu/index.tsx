import AppLogo from "@/components/AppLogo";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGlobalContext } from "@/contexts/GlobalContext";
import { cn } from "@/lib/utils";
import { HamburgerMenuIcon } from "@radix-ui/react-icons";
import { DASHBOARD_CONFIG } from "../../../static/dashboardConfig";
import useT from "../../../hooks/useT";

const { menuItems } = DASHBOARD_CONFIG;

export const DashboardMenu = () => {
  const { currentLanguage } = useGlobalContext();

  return (
    <>
      <aside
        className={cn(
          "max-w-[300px] w-full min-h-screen bg-surface text-surface-foreground space-y-4 p-4"
        )}
      >
        <div className="flex justify-between items-center">
          <AppLogo />
          <Button size={"icon"} variant="outline">
            <HamburgerMenuIcon />
          </Button>
        </div>
        <div className="mb-6">
          <Label>Bank Account</Label>
          <Select>
            <SelectTrigger>
              <SelectValue
                placeholder={useT({
                  pt: "Selecione um banco",
                  en: "Select a bank",
                })}
              />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="nubank">Nubank</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <ul>
          {menuItems.map((item) => {
            return (
              <>
                <a>
                  <li>{item.label[currentLanguage]}</li>
                </a>
              </>
            );
          })}
        </ul>
      </aside>
    </>
  );
};
