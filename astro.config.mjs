import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
export default defineConfig({ site: 'https://retested.vercel.app', trailingSlash: 'always', integrations: [sitemap()] });
