const themes = require("./src/_data/themes.json");

function getAssetMappings() {
  const mappings = new Map();

  for (const theme of themes.items) {
    mappings.set(theme.stylesheetSource, theme.stylesheetOutputPath);

    for (const fileName of theme.rootAssetFiles || []) {
      mappings.set(`${theme.rootAssetSourceDir}/${fileName}`, fileName);
    }
  }

  mappings.set("src/assets/js/shell.js", "shell.js");

  return [...mappings.entries()];
}

module.exports = function (eleventyConfig) {
  for (const [source, destination] of getAssetMappings()) {
    eleventyConfig.addPassthroughCopy({
      [source]: destination
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
      "njk",
      "11ty.js"
    ]
  };
};
