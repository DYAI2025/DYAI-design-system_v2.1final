# Destill QA — reproduce the evidence

All QA in `docs/` was produced by the scripts in this folder running a **real
Chromium 153** headlessly. The browser binary is not stored in the repository.

## Obtain a Chromium (registry-only networks)

The original QA run obtained its browser from the npm registry alone:

```sh
npm pack @sparticuz/chromium          # tarball ships the brotli-compressed binary
tar xzf sparticuz-chromium-*.tgz
# decompress with node's zlib (brotli) and extract the side tars:
#   bin/chromium.br -> chromium        (executable)
#   bin/al2023.tar.br -> lib/          (shared libraries)
#   bin/swiftshader.tar.br -> swift/   (software GL)
#   bin/fonts.tar.br -> fonts/         (Open Sans + fonts.conf)
```

Then export, pointing at wherever you extracted:

```sh
export CHROME_PATH=/path/to/chromium
export LD_LIBRARY_PATH=/path/to/lib:/path/to/swift
export FONTCONFIG_PATH=/path/to/fontconfig-dir   # dir containing a fonts.conf whose <dir> lists the fonts
```

On a normal machine any Chrome/Chromium works: `CHROME_PATH=$(which chrome)`.

## Run everything

```sh
npm install          # puppeteer-core + axe-core (registry only)
npm test             # unit tests for js/logic.js
npm run tokens       # token integrity + radius ordering
npm run contrast     # WCAG ratios computed from tokens.css
npm run e2e          # real-click journey, 23 assertions
npm run axe          # axe-core over six states
npm run shots        # all screenshots in docs/shots
npm run flat         # flatness test renders (shadows removed)
```

## What cannot be verified headlessly here

See “Untested” in `../README.md`: SF Pro rendering (needs macOS; the sandbox
fontconfig served Open Sans), screen-reader walkthroughs, physical touch,
200% browser text zoom, and the metadata/preview path with a genuinely
decodable video (requires a human choosing a real file).
