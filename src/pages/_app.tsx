import type { AppProps } from "next/app";
import Head from "next/head";
import { ApolloProvider } from "@apollo/client";
import { apolloClient } from "../lib/apollo";
import { GlobalContextProvider } from "../contexts/GlobalContext";
import { ReactElement, ReactNode } from "react";
import { NextPage } from "next";
import { APP_CONFIG } from "../static/config";
import SiteLayout from "../containers/SiteLayout";
import { SessionProvider } from "next-auth/react"
import { Session } from "next-auth";
// import * as googleAnalytics from "../lib/gtag";

import "../styles/tailwind.css";
import "../styles/global.scss";
import { debugLog } from "../utils/misc";

// const trackingId = process.env.GA_TRACKING_ID;

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  session: Session
  Component: NextPageWithLayout;
};

const LayoutDefault = function getLayout(page: ReactElement) {
  return <SiteLayout>{page}</SiteLayout>;
};

function MyApp({ Component, session, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout || ((page) => LayoutDefault(page));

  return (
    <>
      <Head>
        <title>{APP_CONFIG.appName}</title>
        <meta name={APP_CONFIG.appName} content={APP_CONFIG.appName} />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <ApolloProvider client={apolloClient}>
        <SessionProvider session={session} >
        <GlobalContextProvider>
          {getLayout(<Component {...pageProps} />)}
        </GlobalContextProvider>
        </SessionProvider>
      </ApolloProvider>
    </>
  );
}

export default MyApp;
