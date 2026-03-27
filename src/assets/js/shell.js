(function () {
  var body = document.body;

  if (!body) {
    return;
  }

  var statusNode = document.querySelector("[data-shell-status]");
  var themeNode = document.querySelector("[data-current-theme]");
  var modeNode = document.querySelector("[data-current-mode]");
  var registryNode = document.getElementById("shell-registry");
  var menuGroups = document.querySelectorAll(".menu-group");
  var themeButtons = document.querySelectorAll("[data-set-theme]");
  var modeButtons = document.querySelectorAll("[data-set-mode]");
  var storageKey = "jules-shell-prefs:v1";
  var messageTimer = null;
  var registry = readRegistry();
  var defaultTheme = getBodyAttr("data-default-theme") || getBodyAttr("data-theme");
  var defaultThemeFamily = getBodyAttr("data-default-theme-family") || getBodyAttr("data-theme-family");
  var defaultMode = getBodyAttr("data-default-mode") || getBodyAttr("data-mode");
  var defaultProfile = getBodyAttr("data-default-profile") || getSettingDefault("profile", "balanced");
  var defaultEffects = getBodyAttr("data-default-effects") || getSettingDefault("effects", "medium");
  var defaultScale = getBodyAttr("data-default-scale") || getSettingDefault("scale", "auto");
  var defaultAccessibility = normalizeAccessibility(getBodyAttr("data-default-accessibility"));

  function getBodyAttr(name) {
    return body.getAttribute(name) || "";
  }

  function setBodyAttr(name, value) {
    body.setAttribute(name, value);
  }

  function removeBodyAttr(name) {
    body.removeAttribute(name);
  }

  function each(nodes, callback) {
    for (var index = 0; index < nodes.length; index += 1) {
      callback(nodes[index], index);
    }
  }

  function findByAttr(nodes, attrName, value) {
    for (var index = 0; index < nodes.length; index += 1) {
      if (nodes[index].getAttribute(attrName) === value) {
        return nodes[index];
      }
    }

    return null;
  }

  function findDataTarget(node, attrName) {
    var current = node;

    while (current && current !== document) {
      if (current.getAttribute && current.getAttribute(attrName) !== null) {
        return current;
      }

      current = current.parentNode;
    }

    return null;
  }

  function containsMenuTarget(target) {
    for (var index = 0; index < menuGroups.length; index += 1) {
      if (menuGroups[index].contains(target)) {
        return true;
      }
    }

    return false;
  }

  function findMenuGroup(node) {
    var current = node;

    while (current && current !== document) {
      if (current.classList && current.classList.contains("menu-group")) {
        return current;
      }

      current = current.parentNode;
    }

    return null;
  }

  function closeMenus(exceptGroup) {
    each(menuGroups, function (group) {
      if (group !== exceptGroup) {
        group.open = false;
      }
    });
  }

  function focusMenuSummary(group) {
    if (!group) {
      return;
    }

    var summary = group.querySelector(".menu-summary");

    if (summary && summary.focus) {
      summary.focus();
    }
  }

  function findMenuLink(node) {
    var current = node;

    while (current) {
      if (current === document) {
        break;
      }

      if (current.tagName === "A" && current.classList && current.classList.contains("menu-link")) {
        return current;
      }

      current = current.parentNode;
    }

    return null;
  }

  function supportsDetailsDisclosure() {
    var details = document.createElement("details");

    if (!("open" in details)) {
      return false;
    }

    return true;
  }

  function readRegistry() {
    if (!registryNode) {
      return {
        themes: {},
        themeAliases: {},
        modes: {},
        settings: {
          groups: {}
        }
      };
    }

    try {
      return JSON.parse(registryNode.textContent);
    } catch (error) {
      return {
        themes: {},
        themeAliases: {},
        modes: {},
        settings: {
          groups: {}
        }
      };
    }
  }

  function getSettingGroup(settingId) {
    return (registry.settings && registry.settings.groups && registry.settings.groups[settingId]) || null;
  }

  function getSettingDefault(settingId, fallbackValue) {
    var group = getSettingGroup(settingId);

    if (!group || typeof group.default === "undefined") {
      return fallbackValue;
    }

    return group.default;
  }

  function getAllowedOptionIds(settingId) {
    var group = getSettingGroup(settingId);

    if (!group || !group.options) {
      return [];
    }

    var optionIds = [];

    for (var index = 0; index < group.options.length; index += 1) {
      optionIds.push(group.options[index].id);
    }

    return optionIds;
  }

  function normalizeSingleSetting(settingId, value, fallbackValue) {
    var allowed = getAllowedOptionIds(settingId);
    var defaultValue = getSettingDefault(settingId, fallbackValue);

    if (allowed.indexOf(value) !== -1) {
      return value;
    }

    return defaultValue;
  }

  function normalizeAccessibility(value) {
    var allowed = getAllowedOptionIds("accessibility");
    var rawValues;
    var normalized = [];

    if (Array.isArray(value)) {
      rawValues = value;
    } else if (typeof value === "string" && value) {
      rawValues = value.split(",");
    } else {
      rawValues = [];
    }

    for (var index = 0; index < rawValues.length; index += 1) {
      var candidate = String(rawValues[index]).trim();

      if (!candidate) {
        continue;
      }

      if (allowed.indexOf(candidate) === -1) {
        continue;
      }

      if (normalized.indexOf(candidate) === -1) {
        normalized.push(candidate);
      }
    }

    return normalized;
  }

  function setAccessibilityFlags(accessibility) {
    var flags = [
      "reduce-motion",
      "higher-contrast",
      "larger-text",
      "simplified-menus"
    ];

    setBodyAttr("data-accessibility", accessibility.join(","));

    for (var index = 0; index < flags.length; index += 1) {
      var flag = flags[index];
      var attrName = "data-a11y-" + flag;

      if (accessibility.indexOf(flag) !== -1) {
        setBodyAttr(attrName, "true");
      } else {
        removeBodyAttr(attrName);
      }
    }
  }

  function getAccessibilityFromBody() {
    return normalizeAccessibility(getBodyAttr("data-accessibility"));
  }

  function setStatusMessage(message) {
    if (!statusNode) {
      return;
    }

    statusNode.textContent = message;

    if (messageTimer) {
      window.clearTimeout(messageTimer);
    }

    if (message !== "Read only") {
      messageTimer = window.setTimeout(function () {
        statusNode.textContent = "Read only";
      }, 1600);
    }
  }

  function syncThemeButtons(activeTheme) {
    each(themeButtons, function (button) {
      var isActive = button.getAttribute("data-set-theme") === activeTheme;

      button.setAttribute("aria-pressed", isActive ? "true" : "false");
    });
  }

  function syncModeButtons(activeMode) {
    each(modeButtons, function (button) {
      var isActive = button.getAttribute("data-set-mode") === activeMode;

      button.setAttribute("aria-pressed", isActive ? "true" : "false");
    });
  }

  function findThemeButton(themeId) {
    return findByAttr(themeButtons, "data-set-theme", themeId);
  }

  function findModeButton(modeId) {
    return findByAttr(modeButtons, "data-set-mode", modeId);
  }

  function resolveThemeId(themeId, options) {
    var resolvedThemeId = themeId;

    if (registry.themeAliases && registry.themeAliases[resolvedThemeId]) {
      resolvedThemeId = registry.themeAliases[resolvedThemeId];
    }

    var meta = registry.themes && registry.themes[resolvedThemeId];

    if (!meta) {
      return null;
    }

    if (!meta.selectable) {
      return null;
    }

    if (meta.availability === "hidden" && !(options && options.allowHidden)) {
      return null;
    }

    return resolvedThemeId;
  }

  function getThemeMeta(themeId, options) {
    var resolvedThemeId = resolveThemeId(themeId, options);
    var registryTheme;
    var button;

    if (resolvedThemeId && registry.themes && registry.themes[resolvedThemeId]) {
      registryTheme = registry.themes[resolvedThemeId];

      return {
        id: registryTheme.id,
        label: registryTheme.label,
        family: registryTheme.familyId || defaultThemeFamily
      };
    }

    button = findThemeButton(themeId);

    if (!button) {
      return null;
    }

    return {
      id: themeId,
      label: button.getAttribute("data-theme-label") || button.textContent.trim(),
      family: button.getAttribute("data-theme-family") || defaultThemeFamily
    };
  }

  function getModeMeta(modeId) {
    var registryMode = registry.modes && registry.modes[modeId];
    var button;

    if (registryMode) {
      return {
        id: registryMode.id,
        label: registryMode.label
      };
    }

    button = findModeButton(modeId);

    if (!button) {
      return null;
    }

    return {
      id: modeId,
      label: button.getAttribute("data-mode-label") || button.textContent.trim()
    };
  }

  function savePreferences() {
    try {
      window.localStorage.setItem(
        storageKey,
        JSON.stringify({
          theme: getBodyAttr("data-theme") || defaultTheme,
          mode: getBodyAttr("data-mode") || defaultMode,
          profile: getBodyAttr("data-profile") || defaultProfile,
          effects: getBodyAttr("data-effects") || defaultEffects,
          scale: getBodyAttr("data-scale") || defaultScale,
          accessibility: getAccessibilityFromBody()
        })
      );
    } catch (error) {
      // Ignore storage failures and keep the page usable.
    }
  }

  function applyTheme(themeId, options) {
    var meta = getThemeMeta(themeId, options);

    if (!meta) {
      return false;
    }

    setBodyAttr("data-theme", meta.id);
    setBodyAttr("data-theme-family", meta.family);

    if (themeNode) {
      themeNode.textContent = meta.label;
    }

    syncThemeButtons(meta.id);

    if (!options || options.persist !== false) {
      savePreferences();
    }

    return true;
  }

  function applyMode(modeId, options) {
    var meta = getModeMeta(modeId);

    if (!meta) {
      return false;
    }

    setBodyAttr("data-mode", meta.id);

    if (modeNode) {
      modeNode.textContent = meta.label;
    }

    syncModeButtons(meta.id);

    if (!options || options.persist !== false) {
      savePreferences();
    }

    return true;
  }

  function applyDisplayPreferences(preferences, options) {
    var normalizedProfile = normalizeSingleSetting("profile", preferences && preferences.profile, defaultProfile);
    var normalizedEffects = normalizeSingleSetting("effects", preferences && preferences.effects, defaultEffects);
    var normalizedScale = normalizeSingleSetting("scale", preferences && preferences.scale, defaultScale);
    var normalizedAccessibility = normalizeAccessibility(preferences && preferences.accessibility);

    setBodyAttr("data-profile", normalizedProfile);
    setBodyAttr("data-effects", normalizedEffects);
    setBodyAttr("data-scale", normalizedScale);
    setAccessibilityFlags(normalizedAccessibility);

    if (!options || options.persist !== false) {
      savePreferences();
    }

    return true;
  }

  function resetDisplay() {
    applyTheme(defaultTheme, { persist: false });
    setBodyAttr("data-theme-family", defaultThemeFamily);
    applyMode(defaultMode, { persist: false });
    applyDisplayPreferences(
      {
        profile: defaultProfile,
        effects: defaultEffects,
        scale: defaultScale,
        accessibility: defaultAccessibility
      },
      { persist: false }
    );
    savePreferences();
    setStatusMessage("Display reset");
  }

  function copyText(text) {
    if (!text) {
      return;
    }

    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(
        function () {
          setStatusMessage("Copied");
        },
        function () {
          fallbackCopy(text);
        }
      );

      return;
    }

    fallbackCopy(text);
  }

  function fallbackCopy(text) {
    var field = document.createElement("textarea");

    field.value = text;
    field.setAttribute("readonly", "");
    field.style.position = "fixed";
    field.style.top = "-9999px";
    document.body.appendChild(field);
    field.select();

    try {
      document.execCommand("copy");
      setStatusMessage("Copied");
    } catch (error) {
      setStatusMessage("Copy unavailable");
    }

    document.body.removeChild(field);
  }

  function readPreferences() {
    try {
      var raw = window.localStorage.getItem(storageKey);

      if (!raw) {
        return null;
      }

      var parsed = JSON.parse(raw);

      if (!parsed || typeof parsed !== "object") {
        return null;
      }

      return parsed;
    } catch (error) {
      return null;
    }
  }

  if (!supportsDetailsDisclosure()) {
    return;
  }

  setBodyAttr("data-enhanced", "true");
  syncThemeButtons(getBodyAttr("data-theme") || defaultTheme);
  syncModeButtons(getBodyAttr("data-mode") || defaultMode);

  var storedPreferences = readPreferences();

  if (!storedPreferences || !storedPreferences.theme || !applyTheme(storedPreferences.theme, { persist: false, allowHidden: true })) {
    applyTheme(defaultTheme, { persist: false });
  }

  if (!storedPreferences || !storedPreferences.mode || !applyMode(storedPreferences.mode, { persist: false })) {
    applyMode(defaultMode, { persist: false });
  }

  applyDisplayPreferences(storedPreferences || {}, { persist: false });

  each(menuGroups, function (group) {
    group.addEventListener("toggle", function () {
      if (group.open) {
        closeMenus(group);
      }
    });
  });

  document.addEventListener("focusin", function (event) {
    if (!containsMenuTarget(event.target)) {
      closeMenus();
    }
  });

  document.addEventListener("click", function (event) {
    var target = event.target;
    var actionMenuGroup = findMenuGroup(target);

    if (!containsMenuTarget(target)) {
      closeMenus();
    }

    var menuLink = findMenuLink(target);

    if (menuLink) {
      closeMenus();
      return;
    }

    var themeButton = findDataTarget(target, "data-set-theme");

    if (themeButton) {
      if (applyTheme(themeButton.getAttribute("data-set-theme"))) {
        setStatusMessage("Theme changed");
      }

      closeMenus();
      focusMenuSummary(actionMenuGroup);
      return;
    }

    var modeButton = findDataTarget(target, "data-set-mode");

    if (modeButton) {
      applyMode(modeButton.getAttribute("data-set-mode"));
      setStatusMessage("Mode changed");
      closeMenus();
      focusMenuSummary(actionMenuGroup);
      return;
    }

    var copyButton = findDataTarget(target, "data-copy-url");

    if (copyButton) {
      if (copyButton.getAttribute("data-copy-url") === "github") {
        copyText("https://github.com/Julesc013");
      } else {
        copyText(window.location.href);
      }

      closeMenus();
      focusMenuSummary(actionMenuGroup);
      return;
    }

    var resetButton = findDataTarget(target, "data-reset-display");

    if (resetButton) {
      resetDisplay();
      closeMenus();
      focusMenuSummary(actionMenuGroup);
    }
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      var activeMenu = findMenuGroup(document.activeElement);

      closeMenus();

      if (activeMenu) {
        focusMenuSummary(activeMenu);
      }
    }
  });
})();
