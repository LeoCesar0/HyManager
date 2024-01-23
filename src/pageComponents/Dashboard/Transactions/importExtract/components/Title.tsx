import { ReactNode } from "react";

export const Title = ({ children }: { children: ReactNode }) => (
  <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 border-b mb-4 py-2 ">
    {children}
  </h2>
);
