const { buildThemeStylesheet } = require("./themes/theme-system");

module.exports = class {
  data() {
    return {
      permalink: "style.css",
      eleventyExcludeFromCollections: true
    };
  }

  render() {
    return buildThemeStylesheet();
  }
};
