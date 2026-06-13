# Required PWA Icons

Place the following icon files in this directory:

| File | Size | Purpose |
|---|---|---|
| `icon-192.png` | 192×192 | Standard Android home screen icon |
| `icon-512.png` | 512×512 | Splash screen & high-res display |
| `icon-maskable-192.png` | 192×192 | Adaptive icon (with safe zone padding) |
| `icon-maskable-512.png` | 512×512 | Adaptive icon large |
| `apple-touch-icon.png` | 180×180 | iOS home screen icon |
| `badge-72.png` | 72×72 | Push notification badge (monochrome) |

## Notes
- All icons should use the United Tractors brand mark on a `#F5C800` (gold) background.
- Maskable icons must keep the logo within the inner 80% safe zone circle.
- `badge-72.png` must be **monochrome** (white on transparent) for Android notification badges.
- Generate with a tool like [PWA Builder](https://www.pwabuilder.com/imageGenerator) or Figma export.
- Referenced in `public/manifest.json` under the `icons` array and `shortcuts[].icons`.
