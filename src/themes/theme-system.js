const fs = require("fs");
const path = require("path");

const themeFamilies = require("../_data/theme-families.json");
const themes = require("../_data/themes.json");
const themeReferences = require("../_data/theme-references.json");
const settingsOptions = require("../_data/settings-options.json");
const settingsUi = require("../_data/settings-ui.json");

const RESERVED_CSS_TEXT = new Set([
  "/* Reserved for family-level overrides. */",
  "/* Reserved for variant-level overrides. */"
]);

function readJson(filePath, fallbackValue) {
  if (!fs.existsSync(filePath)) {
    return fallbackValue;
  }

  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function readText(filePath, fallbackValue) {
  if (!fs.existsSync(filePath)) {
    return fallbackValue;
  }

  const text = fs.readFileSync(filePath, "utf8").replace(/\r\n/g, "\n").trim();

  if (RESERVED_CSS_TEXT.has(text)) {
    return "";
  }

  return text;
}

function hasProperties(value) {
  return value && Object.keys(value).length > 0;
}

function resolveFromRoot(relativePath) {
  return path.join(process.cwd(), relativePath);
}

function toKebabCase(value) {
  return String(value)
    .replace(/^--/, "")
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/[_\s]+/g, "-")
    .toLowerCase();
}

function normalizeCustomPropertyMap(properties) {
  const normalized = {};

  for (const [name, value] of Object.entries(properties || {})) {
    const propertyName = name.startsWith("--") ? name : `--${toKebabCase(name)}`;
    normalized[propertyName] = value;
  }

  return normalized;
}

function normalizeEffects(effectConfig) {
  const normalized = {};
  const reservedKeys = new Set([
    "defaultLevel",
    "defaultEffectsLevel",
    "supportedLevels",
    "levels",
    "notes"
  ]);

  if (!effectConfig || typeof effectConfig !== "object") {
    return normalized;
  }

  if (effectConfig.levels && typeof effectConfig.levels === "object") {
    for (const [levelId, levelProperties] of Object.entries(effectConfig.levels)) {
      if (!levelProperties || typeof levelProperties !== "object") {
        continue;
      }

      for (const [name, value] of Object.entries(levelProperties)) {
        normalized[`--effects-${toKebabCase(levelId)}-${toKebabCase(name)}`] = value;
      }
    }

    return normalized;
  }

  for (const [name, value] of Object.entries(effectConfig)) {
    if (reservedKeys.has(name)) {
      continue;
    }

    normalized[`--effects-2-${toKebabCase(name)}`] = value;
  }

  return normalized;
}

function loadFamilyPackage(entry) {
  const packageDir = resolveFromRoot(entry.packageDir);
  const manifest = readJson(path.join(packageDir, "family.json"), {
    id: entry.id,
    tokenSelector: `body[data-theme-family="${entry.id}"]`
  });

  if (manifest.id !== entry.id) {
    throw new Error(`Theme family package mismatch for ${entry.id}`);
  }

  return {
    ...entry,
    tokenSelector: manifest.tokenSelector || `body[data-theme-family="${entry.id}"]`,
    tokens: normalizeCustomPropertyMap(readJson(path.join(packageDir, "tokens.json"), {})),
    metrics: normalizeCustomPropertyMap(readJson(path.join(packageDir, "metrics.json"), {})),
    effects: normalizeEffects(readJson(path.join(packageDir, "effects.json"), {})),
    overridesCss: readText(path.join(packageDir, "overrides.css"), "")
  };
}

function loadThemePackage(entry) {
  const packageDir = resolveFromRoot(entry.packageDir);
  const manifest = readJson(path.join(packageDir, "theme.json"), {
    id: entry.id,
    tokenSelector: `body[data-theme="${entry.id}"]`
  });

  if (manifest.id !== entry.id) {
    throw new Error(`Theme package mismatch for ${entry.id}`);
  }

  return {
    ...entry,
    tokenSelector: manifest.tokenSelector || `body[data-theme="${entry.id}"]`,
    tokens: normalizeCustomPropertyMap(readJson(path.join(packageDir, "tokens.json"), {})),
    metrics: normalizeCustomPropertyMap(readJson(path.join(packageDir, "metrics.json"), {})),
    effects: normalizeEffects(readJson(path.join(packageDir, "effects.json"), {})),
    overridesCss: readText(path.join(packageDir, "overrides.css"), "")
  };
}

function loadThemeCatalog() {
  return {
    families: themeFamilies.items.map(loadFamilyPackage),
    themes: themes.items.map(loadThemePackage)
  };
}

function buildEntryProperties(entry) {
  return {
    ...entry.tokens,
    ...entry.metrics,
    ...entry.effects
  };
}

function renderPropertyBlock(selector, properties) {
  const lines = Object.entries(properties).map(([name, value]) => `  ${name}: ${value};`);

  return `${selector} {\n${lines.join("\n")}\n}`;
}

function buildThemeStylesheet() {
  const { families, themes: themeEntries } = loadThemeCatalog();
  const chunks = [
    "/* Generated from src/themes and shared CSS partials. */",
    readText(resolveFromRoot("src/assets/css/base.css"), "")
  ];

  for (const family of families) {
    const familyProperties = buildEntryProperties(family);

    if (hasProperties(familyProperties)) {
      chunks.push(renderPropertyBlock(family.tokenSelector, familyProperties));
    }
  }

  for (const theme of themeEntries) {
    const themeProperties = buildEntryProperties(theme);

    if (hasProperties(themeProperties)) {
      chunks.push(renderPropertyBlock(theme.tokenSelector, themeProperties));
    }
  }

  chunks.push(readText(resolveFromRoot("src/assets/css/shell.css"), ""));

  for (const family of families) {
    if (family.overridesCss) {
      chunks.push(family.overridesCss);
    }
  }

  for (const theme of themeEntries) {
    if (theme.overridesCss) {
      chunks.push(theme.overridesCss);
    }
  }

  chunks.push(readText(resolveFromRoot("src/assets/css/effects.css"), ""));
  chunks.push(readText(resolveFromRoot("src/assets/css/modes.css"), ""));
  chunks.push(readText(resolveFromRoot("src/assets/css/responsive.css"), ""));

  return `${chunks.filter(Boolean).join("\n\n")}\n`;
}

function buildThemeAliasMap(themeEntries) {
  const aliases = {};

  for (const entry of themeEntries) {
    for (const alias of entry.aliases || []) {
      aliases[alias] = entry.id;
    }
  }

  return aliases;
}

function buildSettingsRegistry() {
  return {
    groups: Object.fromEntries(
      settingsOptions.groups.map((entry) => [
        entry.id,
        {
          id: entry.id,
          label: entry.label,
          type: entry.type,
          default: entry.default,
          uiVisibility: entry.uiVisibility,
          options: (entry.options || []).map((option) => ({
            id: option.id,
            label: option.label
          })),
          sourceRegistry: entry.sourceRegistry || null
        }
      ])
    ),
    ui: settingsUi.panels || {}
  };
}

function buildThemeReferenceRegistry() {
  return {
    scanDate: themeReferences.scanDate,
    corpusStatus: themeReferences.summary ? themeReferences.summary.corpusStatus : null,
    scannedRoots: (themeReferences.scanRoots || []).map((entry) => ({
      path: entry.path,
      kind: entry.kind,
      accessible: !!entry.accessible,
      imageCount: entry.imageCount,
      notes: entry.notes
    })),
    themes: Object.fromEntries(
      (themeReferences.themes || []).map((entry) => [
        entry.id,
        {
          id: entry.id,
          label: entry.label,
          familyId: entry.familyId,
          screenshotCount: entry.screenshotCount,
          coverageStatus: entry.coverageStatus,
          confidence: entry.confidence,
          referencePaths: entry.referencePaths || [],
          referenceFolders: entry.referenceFolders || [],
          hostSystems: entry.hostSystems || [],
          notes: entry.notes
        }
      ])
    )
  };
}

function buildRuntimeRegistry(modes) {
  const { families, themes: themeEntries } = loadThemeCatalog();

  return {
    themeFamilies: Object.fromEntries(
      families.map((entry) => [
        entry.id,
        {
          id: entry.id,
          label: entry.label,
          status: entry.status,
          catalogVisibility: entry.catalogVisibility,
          legacy: !!entry.legacy,
          defaultEffectsLevel: entry.defaultEffectsLevel,
          defaultProfile: entry.defaultProfile
        }
      ])
    ),
    themes: Object.fromEntries(
      themeEntries.map((entry) => [
        entry.id,
        {
          id: entry.id,
          label: entry.label,
          familyId: entry.familyId,
          status: entry.status,
          completeness: entry.completeness,
          availability: entry.availability,
          visibleInCatalog: !!entry.visibleInCatalog,
          selectable: !!entry.selectable,
          legacy: !!entry.legacy,
          defaultEffectsLevel: entry.defaultEffectsLevel,
          defaultProfile: entry.defaultProfile,
          recommendedScale: entry.recommendedScale,
          supportedAccessibility: entry.supportedAccessibility || [],
          wallpaperId: entry.wallpaperId,
          fontStackId: entry.fontStackId
        }
      ])
    ),
    themeAliases: buildThemeAliasMap(themeEntries),
    themeReferences: buildThemeReferenceRegistry(),
    settings: buildSettingsRegistry(),
    modes: Object.fromEntries(
      (modes || []).map((entry) => [
        entry.id,
        {
          id: entry.id,
          label: entry.label
        }
      ])
    )
  };
}

module.exports = {
  buildRuntimeRegistry,
  buildThemeStylesheet,
  loadThemeCatalog
};
