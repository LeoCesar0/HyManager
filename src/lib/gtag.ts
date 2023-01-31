export const pageview = (url: URL) => {
  window.gtag("config", process.env.GA_TRACKING_ID, {
    page_path: url,
  });
};

type GTagEvent = {
  action: string;
  category: string;
  label: string;
  value: number;
};

// log specific events happening.
export const event = ({ action, category, label, value }: GTagEvent) => {
  window.gtag("event", action, {
    event_category: category,
    event_label: label,
    value: value,
  });
};

// useEffect(() => {
//   if (process.env.NODE_ENV === "production") {
//     console.log("GA LOADED");

//     const handleRouteChange = (url: URL) => {
//       console.log("GA PAGE CHANGE");
//       googleAnalytics.pageview(url);
//     };

//     //When the component is mounted, subscribe to router changes
//     //and log those page views
//     router.events.on("routeChangeComplete", handleRouteChange);

//     // If the component is unmounted, unsubscribe
//     // from the event with the `off` method
//     return () => {
//       router.events.off("routeChangeComplete", handleRouteChange);
//     };
//   }
// }, [router.events]);
