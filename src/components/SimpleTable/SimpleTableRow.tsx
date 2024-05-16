import { ReactNode } from "react";

export const SimpleTableRow = ({ children }: { children: ReactNode }) => (
  <div className="flex gap-2 items-center justify-start p-2 bg-card rounded-lg border">
    {children}
  </div>
);
