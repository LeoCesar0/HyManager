const path = require("path");
/** @type {import('next-i18next').UserConfig} */
module.exports = {
  i18n: {
    defaultLocale: "en",
    locales: ["en", "pt"],
  },
  localePath: path.resolve("./public/locales"),
  reloadOnPrerender: true,
  defaultNS: 'zod'
};
