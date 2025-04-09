import { defineConfig } from 'vite'

export default defineConfig({
    build: {
        target: "esnext", // or "es2019",
    },
    base: "https://sonpd-vitalify-asia.github.io/BIMLoader/",
});
