import type { AppProps } from "next/app";
import Head from "next/head";
import { ApolloProvider } from "@apollo/client";
import { apolloClient } from "../lib/apollo";
import { GlobalContextProvider } from "../contexts/GlobalContext";
import { ReactElement, ReactNode } from "react";
import { NextPage } from "next";
import { APP_CONFIG } from "../static/config";
import SiteLayout from "../containers/SiteLayout";
// import { SessionProvider } from "next-auth/react"
// import { Session } from "next-auth";
// import * as googleAnalytics from "../lib/gtag";

import "../styles/tailwind.css";
import "../styles/global.scss";
import "../styles/tailwindComponents.css";
import "react-toastify/dist/ReactToastify.css";
import { GlobalAuthProvider } from "../contexts/GlobalAuth";
import { ToastContainer } from "react-toastify";
import { GlobalModalProvider } from "../contexts/GlobalModal";

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
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      <ApolloProvider client={apolloClient}>
        {/* <SessionProvider session={session} > */}
        {/* </SessionProvider> */}
        <GlobalAuthProvider>
          <GlobalContextProvider>
            <GlobalModalProvider>
              {getLayout(<Component {...pageProps} />)}
            </GlobalModalProvider>
          </GlobalContextProvider>
        </GlobalAuthProvider>
      </ApolloProvider>
    </>
  );
}

export default MyApp;
