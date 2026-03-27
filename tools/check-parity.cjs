const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const rootDir = process.cwd();
const siteDir = path.join(rootDir, "_site");
const srcDir = path.join(rootDir, "src");

const rootAuthorityFiles = [
  "index.html",
  "style.css",
  "background.heic",
  "background.jpeg",
  "bg_1920x1440.heic",
  "bg_1920x1440.jpg",
  "bg_2560x1920.heic",
  "bg_2560x1920.jpg"
];

const generatedFiles = [
  "index.html",
  "style.css",
  "shell.js",
  "background.heic",
  "background.jpeg",
  "bg_1920x1440.heic",
  "bg_1920x1440.jpg",
  "bg_2560x1920.heic",
  "bg_2560x1920.jpg"
];

const requiredShellMarkers = [
  "desktop-shell",
  "desktop-surface",
  "document-window",
  "menu-bar",
  "status-bar"
];

let failures = 0;

function normalizeText(text) {
  return text.replace(/\r\n/g, "\n");
}

function normalizeWhitespace(text) {
  return normalizeText(text).replace(/\s+/g, " ").trim();
}

function uniqueSorted(items) {
  return [...new Set(items)].sort();
}

function hashFile(filePath) {
  return crypto.createHash("sha256").update(fs.readFileSync(filePath)).digest("hex");
}

function parseUrlValues(source, pattern) {
  const values = [];

  for (const match of source.matchAll(pattern)) {
    values.push(match[1]);
  }

  return values;
}

function stripTags(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ");
}

function extractExternalLinks(html) {
  return uniqueSorted(
    parseUrlValues(html, /(?:href|src)=["'](https?:\/\/[^"']+)["']/gi)
  );
}

function extractLocalHtmlRefs(html) {
  return uniqueSorted(
    parseUrlValues(html, /(?:href|src)=["']([^"']+)["']/gi).filter((value) => {
      return value && !/^[a-z]+:/i.test(value) && !value.startsWith("//");
    })
  );
}

function extractScriptRefs(html) {
  return uniqueSorted(parseUrlValues(html, /<script\b[^>]*src=["']([^"']+)["']/gi));
}

function extractCssRefs(css) {
  return uniqueSorted(
    parseUrlValues(css, /url\(([^)]+)\)/gi)
      .map((value) => value.trim().replace(/^['"]|['"]$/g, ""))
      .filter((value) => value && !/^(?:data:|https?:|\/\/)/i.test(value))
  );
}

function refsExist(baseDir, refs) {
  return refs.every((value) => {
    const cleanValue = value.split("#")[0].split("?")[0];

    if (!cleanValue) {
      return true;
    }

    return fs.existsSync(path.join(baseDir, cleanValue));
  });
}

function isSubset(expected, actual) {
  return expected.every((item) => actual.includes(item));
}

function report(ok, label, detail = "") {
  const prefix = ok ? "PASS" : "FAIL";
  const suffix = detail ? ` - ${detail}` : "";
  console.log(`${prefix} ${label}${suffix}`);

  if (!ok) {
    failures += 1;
  }
}

for (const fileName of rootAuthorityFiles) {
  report(fs.existsSync(path.join(rootDir, fileName)), `root file exists: ${fileName}`);
}

for (const fileName of generatedFiles) {
  report(fs.existsSync(path.join(siteDir, fileName)), `generated file exists: ${fileName}`);
}

const rootHtml = normalizeText(fs.readFileSync(path.join(rootDir, "index.html"), "utf8"));
const siteHtml = normalizeText(fs.readFileSync(path.join(siteDir, "index.html"), "utf8"));
const rootCss = normalizeText(fs.readFileSync(path.join(rootDir, "style.css"), "utf8"));
const siteCss = normalizeText(fs.readFileSync(path.join(siteDir, "style.css"), "utf8"));
const sourceCss = normalizeText(
  fs.readFileSync(path.join(srcDir, "assets", "css", "style.css"), "utf8")
);
const sourceJs = normalizeText(
  fs.readFileSync(path.join(srcDir, "assets", "js", "shell.js"), "utf8")
);
const siteJs = normalizeText(fs.readFileSync(path.join(siteDir, "shell.js"), "utf8"));
const sourceContent = normalizeWhitespace(
  stripTags(fs.readFileSync(path.join(srcDir, "content", "index.html"), "utf8"))
);
const siteText = normalizeWhitespace(stripTags(siteHtml));

const rootExternalLinks = extractExternalLinks(rootHtml);
const siteExternalLinks = extractExternalLinks(siteHtml);
report(
  JSON.stringify(rootExternalLinks) === JSON.stringify(siteExternalLinks),
  "outbound link parity"
);

const rootHtmlRefs = extractLocalHtmlRefs(rootHtml);
const siteHtmlRefs = extractLocalHtmlRefs(siteHtml);
report(isSubset(rootHtmlRefs, siteHtmlRefs), "generated HTML preserves root local refs");
report(refsExist(rootDir, rootHtmlRefs), "root HTML references resolve");
report(refsExist(siteDir, siteHtmlRefs), "generated HTML references resolve");

const scriptRefs = extractScriptRefs(siteHtml);
report(
  JSON.stringify(scriptRefs) === JSON.stringify(["shell.js"]),
  "generated script reference set"
);

const rootCssRefs = extractCssRefs(rootCss);
const siteCssRefs = extractCssRefs(siteCss);
report(
  JSON.stringify(rootCssRefs) === JSON.stringify(siteCssRefs),
  "CSS asset reference parity"
);
report(refsExist(rootDir, rootCssRefs), "root CSS references resolve");
report(refsExist(siteDir, siteCssRefs), "generated CSS references resolve");
report(siteCss === sourceCss, "generated CSS matches source CSS");
report(siteJs === sourceJs, "generated JS matches source JS");

report(siteText.includes(sourceContent), "source content preserved in generated HTML");
report(/<main\b[^>]*id=["']main["']/i.test(siteHtml), "main content region present");
report(/<body\b[^>]*data-shell=["']v2["']/i.test(siteHtml), "body shell hook present");
report(/<noscript>/i.test(siteHtml), "noscript fallback present");
report(siteHtml.includes("js-only-control"), "enhancement-only controls are marked");
report(siteHtml.includes("no-js-note"), "no-JS menu note present");

for (const marker of requiredShellMarkers) {
  report(siteHtml.includes(marker), `shell marker present: ${marker}`);
}

const documentWindowCount =
  (siteHtml.match(/class=["'][^"']*\bdocument-window\b[^"']*["']/gi) || []).length;
report(documentWindowCount === 1, "single document window");

const menuLabels = ["File", "Edit", "View", "Help"];
for (const label of menuLabels) {
  report(new RegExp(`>\\s*${label}\\s*<`, "i").test(siteHtml), `menu label present: ${label}`);
}

const themeChoices = ["win98", "macos9", "cde", "msdos"];
for (const themeId of themeChoices) {
  report(
    siteHtml.includes(`data-set-theme="${themeId}"`),
    `theme control present: ${themeId}`
  );
}

const modeChoices = ["museum", "practical", "safe"];
for (const modeId of modeChoices) {
  report(
    siteHtml.includes(`data-set-mode="${modeId}"`),
    `mode control present: ${modeId}`
  );
}

report(
  hashFile(path.join(rootDir, "bg_2560x1920.jpg")) ===
    hashFile(path.join(siteDir, "bg_2560x1920.jpg")),
  "active wallpaper hash parity"
);

if (failures > 0) {
  process.exit(1);
}
