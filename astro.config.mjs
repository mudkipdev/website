import { defineConfig } from "astro/config";

export default defineConfig({
    site: "https://mudkip.dev",
    trailingSlash: "ignore",

    devToolbar: {
        enabled: false
    },

    markdown: {
        shikiConfig: {
            theme: "catppuccin-macchiato"
        }
    }
})