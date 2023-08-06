/** @type {import('next').NextConfig} */

// const webpack = require("webpack")
// const withGraphQL = require("next-plugin-graphql")

const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["media.graphassets.com", "cdn.midjourney.com"],
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  i18n: {
    locales: ["en", "pt"],
    defaultLocale: "en",
    localeDetection: false
  },
};

module.exports = nextConfig;
