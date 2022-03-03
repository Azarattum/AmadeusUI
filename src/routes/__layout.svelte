<script>
  import { base } from "$app/paths";

  // @ts-nocheck
  let splashes = [
    [320, 568, 2, "splash-5.jpg"],
    [375, 667, 2, "splash-8.jpg"],
    [375, 812, 3, "splash-X.jpg"],
    [414, 736, 3, "splash-plus.jpg"],
  ];
</script>

<svelte:head>
  <title>Amadeus</title>

  <meta name="description" content="Listen to your music with Amadeus!" />
  <link rel="icon" type="image/png" href="{base}/images/favicon.png" />
  <link rel="apple-touch-icon" href="{base}/images/icon.jpg" />
  <link rel="manifest" href="{base}/manifest.json" />

  <meta charset="utf-8" />
  <meta name="apple-mobile-web-app-capable" content="yes" />
  <meta name="apple-mobile-web-app-status-bar-style" content="default" />
  <meta
    name="viewport"
    content="width=device-width,height=device-height,initial-scale=1,user-scalable=no"
  />
  <meta
    name="theme-color"
    content="#ffffff"
    media="(prefers-color-scheme: light)"
  />
  <meta
    name="theme-color"
    content="#000000"
    media="(prefers-color-scheme: dark)"
  />

  {#each splashes as [w, h, r, image]}
    <link
      rel="apple-touch-startup-image"
      media="(device-width: {w}px) and (device-height: {h}px) and (-webkit-device-pixel-ratio: {r})"
      href="{base}/images/{image}"
    />
  {/each}
</svelte:head>

<slot />

<style global lang="postcss">
  @import "__layout.pcss";
</style>
