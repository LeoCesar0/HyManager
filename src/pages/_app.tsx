import "../styles/global.scss";
import "../styles/tailwind.css";
import type { AppProps } from "next/app";
import Head from "next/head";
import { ApolloProvider } from "@apollo/client";
import { apolloClient } from "../lib/apollo";
import { GlobalContextProvider } from "../contexts/GlobalContext";
import { ReactElement, ReactNode, useEffect } from "react";
import { NextPage } from "next";
import { APP_CONFIG } from "../static/Config";
import SiteLayout from "../containers/SiteLayout";
// import * as googleAnalytics from "../lib/gtag";

// const trackingId = process.env.GA_TRACKING_ID;

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

const LayoutDefault = function getLayout(page: ReactElement) {
  return <SiteLayout>{page}</SiteLayout>;
};

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout || ((page) => LayoutDefault(page));


  return (
    <>
      <Head>
        <title>{APP_CONFIG.appName}</title>
        <meta name={APP_CONFIG.appName} content={APP_CONFIG.appName} />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <ApolloProvider client={apolloClient}>
        <GlobalContextProvider>
          {getLayout(<Component {...pageProps} />)}
        </GlobalContextProvider>
      </ApolloProvider>
    </>
  );
}

export default MyApp;
