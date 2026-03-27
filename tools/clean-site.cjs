const fs = require("fs");
const path = require("path");

const siteDir = path.join(process.cwd(), "_site");

fs.rmSync(siteDir, { recursive: true, force: true });
