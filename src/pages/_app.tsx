import type { AppProps } from "next/app";
import Head from "next/head";
import { GlobalContextProvider } from "../contexts/GlobalContext";
import { ReactElement, ReactNode } from "react";
import { NextPage } from "next";
import { APP_CONFIG } from "../static/appConfig";
import "../styles/global.scss";
import "../styles/tailwind.css";
import "react-toastify/dist/ReactToastify.css";

import { GlobalAuthProvider } from "../contexts/GlobalAuth";
import { ToastContainer } from "react-toastify";
import { GlobalModalProvider } from "../contexts/GlobalModal";
import { GlobalCacheProvider } from "@contexts/GlobalCache";
import DefaultLayout from "@/layouts/DefaultLayout";

// const trackingId = process.env.GA_TRACKING_ID;

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

const LayoutDefault = function getLayout(page: ReactElement) {
  return <DefaultLayout>{page}</DefaultLayout>;
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
