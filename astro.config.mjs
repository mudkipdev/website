import { defineConfig } from "astro/config";

import cloudflare from "@astrojs/cloudflare";

export default defineConfig({
    site: "https://mudkip.dev",
    devToolbar: {
        enabled: false
    },
    markdown: {
        shikiConfig: {
            theme: "catppuccin-macchiato"
        }
    },
    output: "server",
    adapter: cloudflare({
        imageService: "passthrough"
    })
})