const fs = require("fs");
const path = require("path");

const pages = require("./_data/pages.json");
const apps = require("./_data/apps.json");
const themes = require("./_data/themes.json");
const themeFamilies = require("./_data/theme-families.json");
const modes = require("./_data/modes.json");
const capabilities = require("./_data/capabilities.json");
const settingsOptions = require("./_data/settings-options.json");
const settingsUi = require("./_data/settings-ui.json");
const { buildRuntimeRegistry } = require("./themes/theme-system");

function getRequiredItem(registryName, items, id) {
  const item = items.find((entry) => entry.id === id);

  if (!item) {
    throw new Error(`Missing ${registryName} registry item: ${id}`);
  }

  return item;
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function escapeInlineJson(value) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}

function routeToPermalink(route) {
  if (route === "/") {
    return "index.html";
  }

  const trimmed = route.replace(/^\/+/, "");

  if (trimmed.endsWith("/")) {
    return `${trimmed}index.html`;
  }

  return trimmed;
}

function getSettingsGroup(groupId) {
  return getRequiredItem("settings-options", settingsOptions.groups, groupId);
}

function getCatalogStatusLabel(entry) {
  if (entry.selectable && entry.availability === "enabled") {
    return "Available";
  }

  if (entry.status === "partial") {
    return "Preview";
  }

  return "Unavailable";
}

function groupThemesByFamily(themeEntries) {
  return themeFamilies.items
    .filter((family) => family.catalogVisibility !== "hidden")
    .map((family) => ({
      family,
      themes: themeEntries.filter((entry) => entry.familyId === family.id)
    }))
    .filter((group) => group.themes.length > 0);
}

function resolveHomePage() {
  const page = getRequiredItem("pages", pages.items, "home");
  const app = getRequiredItem("apps", apps.items, page.appId);
  const theme = getRequiredItem("themes", themes.items, page.defaultThemeId);
  const themeFamily = getRequiredItem("theme-families", themeFamilies.items, theme.familyId);
  const mode = getRequiredItem("modes", modes.items, page.defaultModeId);
  const visibleCatalogThemes = themes.items.filter((entry) => entry.visibleInCatalog);
  const selectableThemes = visibleCatalogThemes.filter((entry) => entry.selectable);
  const catalogThemes = visibleCatalogThemes.filter((entry) => !entry.selectable);
  const availableModes = modes.items.slice();

  for (const capabilityId of page.capabilityIds || []) {
    getRequiredItem("capabilities", capabilities.items, capabilityId);
  }

  return {
    page,
    app,
    theme,
    themeFamily,
    mode,
    selectableThemes,
    catalogThemeGroups: groupThemesByFamily(catalogThemes),
    availableModes,
    settingsGroups: settingsOptions.groups.slice(),
    viewSettingsUi: settingsUi.panels.view || {}
  };
}

function readContentFragment(contentSource) {
  return fs.readFileSync(path.join(process.cwd(), contentSource), "utf8");
}

function renderMenuAction(item) {
  const className = item.className ? ` ${escapeHtml(item.className)}` : "";

  if (item.kind === "link") {
    return `<a class="menu-action menu-link${className}" href="${escapeHtml(item.href)}">${escapeHtml(item.label)}</a>`;
  }

  if (item.kind === "button") {
    return `<button class="menu-action menu-button${className}" type="button" ${item.dataAttr}="${escapeHtml(item.dataValue)}">${escapeHtml(item.label)}</button>`;
  }

  return `<p class="menu-note${className}">${escapeHtml(item.label)}</p>`;
}

function renderModeChoices(availableModes, currentModeId) {
  return availableModes
    .map(
      (entry) => `<button
                class="menu-action menu-choice js-only-control"
                type="button"
                data-set-mode="${escapeHtml(entry.id)}"
                data-mode-label="${escapeHtml(entry.label)}"
                aria-pressed="${entry.id === currentModeId ? "true" : "false"}"
              >${escapeHtml(entry.label)}</button>`
    )
    .join("");
}

function renderSelectableThemeChoices(selectableThemes, currentThemeId) {
  return selectableThemes
    .map(
      (entry) => `<button
                class="menu-action menu-choice js-only-control"
                type="button"
                data-set-theme="${escapeHtml(entry.id)}"
                data-theme-family="${escapeHtml(entry.familyId)}"
                data-theme-label="${escapeHtml(entry.label)}"
                data-theme-status="${escapeHtml(entry.status)}"
                data-theme-availability="${escapeHtml(entry.availability)}"
                aria-pressed="${entry.id === currentThemeId ? "true" : "false"}"
              >${escapeHtml(entry.label)}</button>`
    )
    .join("");
}

function renderThemeCatalogGroups(catalogThemeGroups) {
  return catalogThemeGroups
    .map(
      ({ family, themes: familyThemes }) => `<section class="menu-catalog-group" data-theme-family-group="${escapeHtml(family.id)}">
                  <p class="menu-catalog-family">${escapeHtml(family.label)}</p>
                  <div class="menu-catalog-list">
                    ${familyThemes
                      .map(
                        (entry) => `<p
                      class="menu-note menu-catalog-entry"
                      data-theme-catalog-id="${escapeHtml(entry.id)}"
                      data-theme-status="${escapeHtml(entry.status)}"
                      data-theme-availability="${escapeHtml(entry.availability)}"
                    ><span class="menu-catalog-label">${escapeHtml(entry.label)}</span><span class="menu-catalog-status">${escapeHtml(
                          getCatalogStatusLabel(entry)
                        )}</span></p>`
                      )
                      .join("")}
                  </div>
                </section>`
    )
    .join("");
}

function renderAdvancedSettingsNote(settingsGroups, viewSettingsUi) {
  if (!viewSettingsUi.showAdvancedNote) {
    return "";
  }

  const advancedLabels = (viewSettingsUi.advancedGroups || [])
    .map((groupId) => getSettingsGroup(groupId).label.toLowerCase())
    .join(", ");

  return `<section class="menu-section" aria-label="Display settings roadmap">
                  <p class="menu-section-title">Display settings</p>
                  <p class="menu-note">Advanced display settings for ${escapeHtml(
                    advancedLabels
                  )} are scaffolded in the registry and stay on safe defaults in V2.</p>
                </section>`;
}

function renderMenuGroup(group) {
  return `<li class="menu-item">
              <details class="menu-group" data-menu="${escapeHtml(group.id)}">
                <summary class="menu-summary"><span>${escapeHtml(group.label)}</span></summary>
                <div class="menu-panel">
                  ${group.panel}
                </div>
              </details>
            </li>`;
}

module.exports = class {
  data() {
    const { page } = resolveHomePage();

    return {
      permalink: routeToPermalink(page.route),
      eleventyExcludeFromCollections: true
    };
  }

  render() {
    const {
      page,
      app,
      theme,
      themeFamily,
      mode,
      selectableThemes,
      catalogThemeGroups,
      availableModes,
      settingsGroups,
      viewSettingsUi
    } = resolveHomePage();
    const contentHtml = readContentFragment(page.contentSource);
    const githubProfileUrl = "https://github.com/Julesc013";
    const runtimeRegistry = escapeInlineJson(buildRuntimeRegistry(availableModes));
    const profileDefaults = getSettingsGroup("profile");
    const effectsDefaults = getSettingsGroup("effects");
    const scaleDefaults = getSettingsGroup("scale");
    const accessibilityDefaults = getSettingsGroup("accessibility");
    const menuGroups = [
      {
        id: "file",
        label: "File",
        panel: [
          renderMenuAction({ kind: "link", label: "Skip to content", href: "#main" }),
          renderMenuAction({ kind: "link", label: "GitHub profile", href: githubProfileUrl })
        ].join("")
      },
      {
        id: "edit",
        label: "Edit",
        panel: [
          renderMenuAction({ kind: "button", label: "Copy page URL", dataAttr: "data-copy-url", dataValue: "page", className: "js-only-control" }),
          renderMenuAction({ kind: "button", label: "Copy GitHub URL", dataAttr: "data-copy-url", dataValue: "github", className: "js-only-control" }),
          renderMenuAction({ kind: "note", label: "Read only document" })
        ].join("")
      },
      {
        id: "view",
        label: "View",
        panel: `<section class="menu-section js-only-control" aria-label="Mode choices">
                  <p class="menu-section-title">Mode</p>
                  <div class="menu-choice-list">
                    ${renderModeChoices(availableModes, mode.id)}
                  </div>
                </section>
                <section class="menu-section js-only-control" aria-label="Available themes">
                  <p class="menu-section-title">Available now</p>
                  <div class="menu-choice-list">
                    ${renderSelectableThemeChoices(selectableThemes, theme.id)}
                  </div>
                </section>
                <section class="menu-section" aria-label="Theme catalog">
                  <p class="menu-section-title">Theme catalog</p>
                  ${renderThemeCatalogGroups(catalogThemeGroups)}
                </section>
                ${renderAdvancedSettingsNote(settingsGroups, viewSettingsUi)}
                <p class="menu-note no-js-note">Enhanced theme switching still needs optional JavaScript. The catalog remains readable without it.</p>`
      },
      {
        id: "help",
        label: "Help",
        panel: [
          renderMenuAction({ kind: "button", label: "Reset display", dataAttr: "data-reset-display", dataValue: "true", className: "js-only-control" }),
          renderMenuAction({ kind: "link", label: "Skip to content", href: "#main" }),
          renderMenuAction({ kind: "link", label: "GitHub profile", href: githubProfileUrl })
        ].join("")
      }
    ];

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(page.title)}</title>
  <meta name="description" content="${escapeHtml(page.description)}">
  <link rel="stylesheet" href="${escapeHtml(theme.stylesheetOutputPath)}">
  <noscript>
    <style>
      body {
        --desktop-padding: 12px;
        --window-max-width: 72rem;
        --wallpaper-opacity: 0;
        --window-offset-shadow: 0 0 0 transparent;
        --window-shadow: none;
        --window-body-padding: 0;
        --document-padding: 14px 16px;
      }

      body::before {
        display: none;
      }

      .window {
        border-width: 1px;
        box-shadow: none;
      }

      .title-bar,
      .menu-bar,
      .status-bar {
        background: var(--face);
        color: var(--text);
      }

      .window-controls,
      .js-only-control {
        display: none !important;
      }

      .menu-panel {
        position: static;
        min-width: 0;
        margin-top: 4px;
        border-width: 1px;
        box-shadow: none;
      }

      .status-segment {
        background: transparent;
        border: 0;
        padding: 0 10px 0 0;
      }

      .status-segment--mode {
        display: none;
      }

      .document-content {
        border-width: 1px;
      }

      .no-js-note {
        display: block !important;
      }
    </style>
  </noscript>
  <script id="shell-registry" type="application/json">${runtimeRegistry}</script>
  <script src="shell.js" defer></script>
</head>
<body
  data-app="${escapeHtml(app.id)}"
  data-shell="${escapeHtml(page.shellId || "v2")}"
  data-enhanced="false"
  data-theme="${escapeHtml(theme.id)}"
  data-theme-family="${escapeHtml(themeFamily.id)}"
  data-mode="${escapeHtml(mode.id)}"
  data-profile="${escapeHtml(profileDefaults.default)}"
  data-effects="${escapeHtml(effectsDefaults.default)}"
  data-scale="${escapeHtml(scaleDefaults.default)}"
  data-accessibility="${escapeHtml((accessibilityDefaults.default || []).join(","))}"
  data-default-theme="${escapeHtml(theme.id)}"
  data-default-theme-family="${escapeHtml(themeFamily.id)}"
  data-default-mode="${escapeHtml(mode.id)}"
  data-default-profile="${escapeHtml(profileDefaults.default)}"
  data-default-effects="${escapeHtml(effectsDefaults.default)}"
  data-default-scale="${escapeHtml(scaleDefaults.default)}"
  data-default-accessibility="${escapeHtml((accessibilityDefaults.default || []).join(","))}"
>
  <a class="skip-link" href="#main">Skip to content</a>

  <div class="desktop-shell">
    <div class="desktop-surface">
      <article class="document-window window" aria-labelledby="window-title">
        <header class="window-header">
          <div class="title-bar">
            <p id="window-title" class="window-title">${escapeHtml(page.title)}</p>

            <div class="window-controls" aria-hidden="true">
              <span class="window-control window-control--minimize"></span>
              <span class="window-control window-control--maximize"></span>
              <span class="window-control window-control--close"></span>
            </div>
          </div>

          <nav class="menu-bar" aria-label="Document menu">
            <ul class="menu-list">
              ${menuGroups.map((group) => renderMenuGroup(group)).join("")}
            </ul>
          </nav>
        </header>

        <main id="main" class="window-body window-content" tabindex="-1">
${contentHtml}
        </main>

        <footer class="status-bar" aria-label="Document status">
          <p class="status-segment"><span data-shell-status role="status" aria-live="polite" aria-atomic="true">Read only</span></p>
          <p class="status-segment">Single window</p>
          <p class="status-segment">Theme: <span data-current-theme>${escapeHtml(theme.label)}</span></p>
          <p class="status-segment status-segment--mode">Mode: <span data-current-mode>${escapeHtml(mode.label)}</span></p>
        </footer>
      </article>
    </div>
  </div>
</body>
</html>`;
  }
};
