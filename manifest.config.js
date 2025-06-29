import pkg from "./package.json";
import { defineManifest } from "@crxjs/vite-plugin";

const icons = { 128: "public/icon128.png" };

export default defineManifest({
  icons,
  name: pkg.name,
  author: pkg.author,
  manifest_version: 3,
  version: pkg.version,
  offline_enabled: true,
  description: pkg.description,
  homepage_url: pkg.homepage_url,
  action: { default_icon: icons, default_popup: "src/popup/index.html" },
});
