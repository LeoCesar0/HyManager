/** @type {import('next').NextConfig} */

// const webpack = require("webpack")
// const withGraphQL = require("next-plugin-graphql")

const nextConfig = {
  reactStrictMode: false,
  webpack: (config) => {
    config.module.rules.push({
      test: /\.(graphql|gql)$/,
      exclude: /node_modules/,
      loader: "graphql-tag/loader",
    });
    return config;
  },
  webpackDevMiddleware: (config) => {
    return config;
  },
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
