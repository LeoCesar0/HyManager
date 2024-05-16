import algoliasearch from "algoliasearch";

// Connect and authenticate with your Algolia app
export const ALGOLIA_CLIENT = () => {
  return algoliasearch(
    process.env.NEXT_PUBLIC_ALGOLIA_API_ID || "",
    process.env.NEXT_PUBLIC_ALGOLIA_WRITE_API_KEY || ""
  );
};

export const ALGOLIA_INDEXES = {
  CREDITORS: "hymanager",
};
