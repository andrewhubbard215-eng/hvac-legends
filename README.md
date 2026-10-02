# HVAC Legends

Shop-floor HVAC trainer. This repo is **HVAC Legends**.

Twin (unbranded): [hvac-allstars](https://github.com/andrewhubbard215-eng/hvac-allstars)

## Live preview
https://andrewhubbard215-eng.github.io/legends/

Source entry: `shop-floor/index.html` (redirects to root `index.html`)

## Bay
- Shop floor first
- Recovery second: bare outdoor unit on top, tools in the tray, tank on the scale first
- Scale stop **22.2 lb R-410A** (80% stop cue)
- Hoses drag like Land Lugs (pointer capture + ghost + elementsFromPoint, 8px slop, tap-then-tap fallback)
- Blue LO + red HI; yellow vacuum unlocks micron gauge
- Manifold LP/HP drop while recovery runs
- No school marks. No HCR catalog. No Lincoln Tech / campus branding.

## Files
- `index.html` — shop floor shell
- `shop-floor/index.html` — preview door
- `styles.css` — dark shop theme; hub-grid cards match Allstars sizes
- `app.js` — Shop → Recovery / Land Lugs
- `recovery.js` + `recovery.css` — Recovery bench
- `assets/` — SVG art (unit, hoses, tank, scale, machine, manifold)

## Footer
`HVAC Legends · 1.0`
