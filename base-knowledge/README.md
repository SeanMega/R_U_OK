# Base Knowledge

This directory is the fixed, read-only base knowledge set for the demo.

It contains curated Markdown regulations and standards that are versioned with the project. Product workflows should treat these files as immutable source assets: users can browse or compile them into an index, but project evidence, findings, and derived gaps must live outside this folder.

Run these commands after intentional updates:

```bash
npm run kb:compile
npm run kb:verify
```

`kb:compile` writes `src/data/standard-index.json` and `src/data/base-knowledge-manifest.json`. `kb:verify` checks the source file hashes against the manifest so accidental edits are caught.
