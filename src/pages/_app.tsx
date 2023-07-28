import type { AppProps } from "next/app";
import Head from "next/head";
import { GlobalContextProvider } from "../contexts/GlobalContext";
import { ReactElement, ReactNode } from "react";
import { NextPage } from "next";
import { APP_CONFIG } from "../static/Config";
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
import { GlobalCacheProvider } from "@contexts/GlobalCache";

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
      {/* <SessionProvider session={session} > */}
      {/* </SessionProvider> */}
      <GlobalCacheProvider>
        <GlobalAuthProvider>
          <GlobalContextProvider>
            <GlobalModalProvider>
              {getLayout(<Component {...pageProps} />)}
            </GlobalModalProvider>
          </GlobalContextProvider>
        </GlobalAuthProvider>
      </GlobalCacheProvider>
    </>
  );
}

export default MyApp;
