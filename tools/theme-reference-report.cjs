const fs = require("fs");
const path = require("path");

const manifestPath = path.join(process.cwd(), "src", "_data", "theme-references.json");
const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
const allowedStatuses = new Set(["strong", "usable", "weak", "missing"]);
const shouldValidate = process.argv.includes("--validate");

let failures = 0;

function fail(message) {
  console.error(`FAIL ${message}`);
  failures += 1;
}

function pass(message) {
  console.log(`PASS ${message}`);
}

function summarizeByStatus(entries) {
  const counts = {
    strong: 0,
    usable: 0,
    weak: 0,
    missing: 0
  };

  for (const entry of entries) {
    counts[entry.coverageStatus] = (counts[entry.coverageStatus] || 0) + 1;
  }

  return counts;
}

const themeEntries = manifest.themes || [];
const coverageCounts = summarizeByStatus(themeEntries);

if (!Array.isArray(manifest.scanRoots) || manifest.scanRoots.length === 0) {
  fail("scanRoots must be present");
} else {
  pass("scanRoots present");
}

if (!manifest.summary || typeof manifest.summary.corpusStatus !== "string") {
  fail("summary.corpusStatus must be present");
} else {
  pass(`corpus status recorded as ${manifest.summary.corpusStatus}`);
}

for (const entry of themeEntries) {
  if (!entry.id || !entry.label || !entry.familyId) {
    fail(`theme entry is missing core identity fields: ${JSON.stringify(entry)}`);
    continue;
  }

  if (!allowedStatuses.has(entry.coverageStatus)) {
    fail(`theme ${entry.id} has invalid coverageStatus ${entry.coverageStatus}`);
  }

  if (!Array.isArray(entry.referencePaths) || !Array.isArray(entry.referenceFolders)) {
    fail(`theme ${entry.id} must use array-based referencePaths and referenceFolders`);
  }
}

console.log(`Theme reference report for ${manifest.scanDate}`);
console.log(`Corpus status: ${manifest.summary ? manifest.summary.corpusStatus : "unknown"}`);
console.log("Coverage counts:");
for (const status of ["strong", "usable", "weak", "missing"]) {
  console.log(`- ${status}: ${coverageCounts[status] || 0}`);
}

console.log("Themes:");
for (const entry of themeEntries) {
  console.log(`- ${entry.id}: ${entry.coverageStatus} (${entry.screenshotCount} screenshots)`);
}

if (shouldValidate) {
  console.log("Path validation:");

  for (const entry of manifest.scanRoots || []) {
    if (fs.existsSync(entry.path)) {
      pass(`scan root exists: ${entry.path}`);
    } else {
      fail(`scan root missing: ${entry.path}`);
    }
  }

  for (const entry of themeEntries) {
    for (const referencePath of entry.referencePaths || []) {
      if (fs.existsSync(referencePath)) {
        pass(`reference path exists for ${entry.id}: ${referencePath}`);
      } else {
        fail(`reference path missing for ${entry.id}: ${referencePath}`);
      }
    }

    for (const referenceFolder of entry.referenceFolders || []) {
      if (fs.existsSync(referenceFolder)) {
        pass(`reference folder exists for ${entry.id}: ${referenceFolder}`);
      } else {
        fail(`reference folder missing for ${entry.id}: ${referenceFolder}`);
      }
    }
  }
}

if (failures > 0) {
  process.exit(1);
}
