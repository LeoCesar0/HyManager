import type { AppProps } from "next/app";
import Head from "next/head";
import { ReactElement, ReactNode } from "react";
import { NextPage } from "next";
import { APP_CONFIG } from "../static/appConfig";
import "../styles/global.scss";
import "../styles/tailwind.css";
import "../styles/components.scss";
import "react-toastify/dist/ReactToastify.css";

import { appWithTranslation } from "next-i18next";
import { ToastContainer } from "react-toastify";
import DefaultLayout from "@/layouts/DefaultLayout";
import ContextProviders from "@/contexts/ContextProviders";
import { SWRConfig } from "swr";

import { Inter } from "next/font/google";

const inter = Inter({
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal"],
  subsets: ["latin"],
  display: "swap",
});

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
      <SWRConfig
        value={{ provider: () => new Map(), revalidateOnFocus: false }}
      >
        <ContextProviders>
          {getLayout(
            <div className={inter.className}>
              <Component {...pageProps} />
            </div>
          )}
        </ContextProviders>
      </SWRConfig>
    </>
  );
}

export default appWithTranslation(MyApp);
