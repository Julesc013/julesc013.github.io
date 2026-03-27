# Theme Reference Map

Prompt 4 scanned `C:\tmp` and `C:\Users\Jules\AppData\Local\Temp` on `2026-03-28` for the requested theme-reference corpus.

No credible OS screenshot corpus was present. The only discovered image sets were:

- a Chrome extension asset pack with icons and country flags
- repeated installer branding icons in transient temp folders

`src/_data/theme-references.json` is now the machine-readable source of truth for per-theme reference coverage. `node tools/theme-reference-report.cjs --validate` summarizes the manifest and checks the recorded temp roots.

Current readiness:

- all requested visible theme IDs are `missing` in the temp corpus
- no theme is currently ready for screenshot-driven fidelity work from `/tmp` alone
- later parallel theme prompts will need fresh references from another source before claiming visual fidelity
