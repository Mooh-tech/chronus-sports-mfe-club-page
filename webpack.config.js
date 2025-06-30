const { merge } = require("webpack-merge");
const singleSpaDefaults = require("webpack-config-single-spa-ts");
const { VueLoaderPlugin } = require("vue-loader");
const path = require("path");

module.exports = (webpackConfigEnv) => {
  const defaultConfig = singleSpaDefaults({
    orgName: "chronus-sports",
    projectName: "club-page",
    webpackConfigEnv,
  });

  const config = merge(defaultConfig, {
    module: {
      rules: [
        {
          test: /\.vue$/,
          use: ["vue-loader"],
        },
        { test: /\.([cm]?ts|tsx)$/, loader: "ts-loader" },
      ],
    },
    stats: {
      performance: false,
    },
    externals: ["vue", /^@mobs2\/.+/],
    plugins: [new VueLoaderPlugin()],
    // output: {
    //   libraryTarget: "system",
    // },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src"),
      },
      extensions: [".ts", ".tsx", ".js", ".vue"],
    },
  });

  return config;
};
