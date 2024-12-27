import { defineConfig } from "astro/config";

import react from "@astrojs/react";

export default defineConfig({
    site: "https://mudkip.dev",
    trailingtSlash: "ignore",
    
    devToolbar: {
        enabled: false
    },
    
    markdown: {
        shikiConfig: {
            theme: "catppuccin-macchiato"
        }
    }
})