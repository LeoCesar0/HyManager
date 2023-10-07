import React from "react";
import { GlobalCacheProvider } from "./GlobalCache";
import { GlobalAuthProvider } from "./GlobalAuth";
import { GlobalContextProvider } from "./GlobalContext";
import { GlobalModalProvider } from "./GlobalModal";
import { ReactNode } from "react";
import { GlobalDashboardStore } from "./GlobalDashboardStore";

type Node = React.FC<{ children: ReactNode }>;

const ContextProviders: Node = ({ children }) => {
  return (
    <>
      <Providers>{children}</Providers>
    </>
  );
};

export default ContextProviders;

const BuildProviderTree = (providers: Node[]): Node => {
  if (providers.length === 1) {
    return providers[0];
  }
  const A: Node = providers.shift()!;
  const B: Node = providers.shift()!;
  const C: Node = ({ children }) => (
    <A>
      <B>{children}</B>
    </A>
  );

  return BuildProviderTree([C, ...providers]);
};

/* ------------- COLOCAR NA ORDEM DE IMPORTÂNCIA | PAI -> FILHO ------------- */
const Providers = BuildProviderTree([
  GlobalCacheProvider,
  GlobalAuthProvider,
  GlobalContextProvider,
  GlobalDashboardStore,
  GlobalModalProvider,
]);
