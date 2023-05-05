/** @type {import('next').NextConfig} */

// const webpack = require("webpack")
// const withGraphQL = require("next-plugin-graphql")

const nextConfig = {
  reactStrictMode: false,

  images: {
    domains: ["media.graphassets.com", "cdn.midjourney.com"],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  i18n: {
    locales: ["en", "pt"],
    defaultLocale: "en",
    localeDetection: false
  },
};

module.exports = nextConfig;
