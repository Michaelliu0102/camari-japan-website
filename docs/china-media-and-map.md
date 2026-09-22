# China media delivery and contact map

The China build uses a versioned media manifest (`src/generated/china-media.json`),
prepared by `scripts/prepare-china-media.mjs`. Original images remain untouched.
Raster photos have 320, 768 and 1920 pixel bounding-box WebP variants, each under
400,000 bytes. QR images use lossless PNG and SVG logos remain vectors.

Upload the entire generated `images-v1` directory to the root of
`camari-cn-media-shanghai` before building with:

```
NEXT_PUBLIC_SITE_KEY=china
NEXT_PUBLIC_CHINA_MEDIA_URL=http://media.camari.com.cn
```

Switch this origin to HTTPS when the media domain certificate is configured.
The custom Next image loader sends browsers directly to CDN files, without
passing through ECS or requiring OSS image-processing query parameters.
Content hashes avoid replacing images already cached by the CDN. New CMS images
not in the manifest keep their original URLs until the next synchronization.
International builds keep their existing image URLs and Next image optimizer.

## China map and default media

The China build loads AMap JS API 2.0 directly using NEXT_PUBLIC_AMAP_KEY and
NEXT_PUBLIC_AMAP_SECURITY_CODE at build time. Keep their values out of Git.
The JS security code is included in the browser integration; configure the key's
allowed domains in the AMap console. The user-supplied search iframe did not load
map tiles reliably and was replaced with the SDK using the original place coordinates.

China enables external media by default, ignores previous consent selections and
shows neither the Cookie dialog nor its footer settings button. Other builds keep
their existing opt-in flow. Chinese policy text describes this behavior.

Map heights are 360px / 440px / 560px for phone / tablet / desktop, with full width.
On load failure, the blank map collapses into an address, retry and navigation card.
Footer LINE, Xiaohongshu and TikTok icons are inline SVG paths so they require no
cross-origin mask requests or CDN access.
