const fs = require("fs");
const path = require("path");

const rootAssetFiles = [
  "background.heic",
  "background.jpeg",
  "bg_1920x1440.heic",
  "bg_1920x1440.jpg",
  "bg_2560x1920.heic",
  "bg_2560x1920.jpg"
];

module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy({
    "src/assets/js/shell.js": "shell.js"
  });

  eleventyConfig.addWatchTarget("src/themes");
  eleventyConfig.addWatchTarget("src/assets/css");

  for (const fileName of rootAssetFiles) {
    eleventyConfig.addPassthroughCopy({
      [`src/assets/img/wallpapers/${fileName}`]: fileName
    });
  }

  if (fs.existsSync(path.join(__dirname, "public"))) {
    eleventyConfig.addPassthroughCopy({
      public: "."
    });
  }

  return {
    dir: {
      input: "src",
      includes: "_includes",
      data: "_data",
      output: "_site"
    },
    templateFormats: [
      "11ty.js"
    ]
  };
};
