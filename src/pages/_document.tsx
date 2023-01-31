import { Html, Head, Main, NextScript, DocumentContext } from "next/document";

// const trackingId = process.env.GA_TRACKING_ID;

export default function Document({ locale }: DocumentContext) {
  let lang = locale || "en";
  if (typeof lang !== "string") lang = "en";

  return (
    <Html lang={lang}>
      <Head>
        {/* <script
          async
          src={`https://www.googletagmanager.com/gtag/js?id=${trackingId}`}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${trackingId}', {
                  page_path: window.location.pathname,
                });
            `,
          }}
        /> */}
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
