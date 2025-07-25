import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

const manifestForPlugIn = {
    registerType: "autoUpdate", // SW otomatis update
    workbox: {
        maximumFileSizeToCacheInBytes: 6 * 1024 * 1024,
        runtimeCaching: [
            {
                urlPattern: /^https:\/\/firebasestorage\.googleapis\.com\/.*/,
                handler: "CacheFirst",
                options: {
                    cacheName: "firebase-storage-cache",
                    expiration: {
                        maxEntries: 50,
                        maxAgeSeconds: 1 * 12 * 60 * 60, // 12 Jam
                    },
                    cacheableResponse: {
                        statuses: [0, 200],
                    },
                },
            },
        ],
    },
    includeAssets: ["favicon.ico", "apple-touch-icon.png"], // Aset lain yang spesifik di public
    manifest: {
        name: "Indonesia Kaya",
        short_name: "Indonesia Kaya",
        description: "AR App for Galeri Indonesia Kaya ",
        version: "1.0.8",
        icons: [
            {
                src: "/android-chrome-192x192.png",
                sizes: "192x192",
                type: "image/png",
                purpose: "any",
            },
            {
                src: "/android-chrome-512x512.png",
                sizes: "512x512",
                type: "image/png",
                purpose: "any",
            },
            {
                src: "/apple-touch-icon.png",
                sizes: "180x180",
                type: "image/png",
                purpose: "any",
            },
        ],
        theme_color: "#171717",
        background_color: "#fff",
        display: "standalone",
        scope: "/",
        start_url: "/",
        orientation: "portrait",
    },
};

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react(), VitePWA(manifestForPlugIn)],
    preview: {
        port: 4173,
        strictPort: true,
    },
    server: {
        port: 4173,
        strictPort: true,
        host: '127.0.0.1',
    }, 
});
