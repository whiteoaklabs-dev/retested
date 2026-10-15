import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
export default defineConfig({ site: 'https://whiteoaklabs-dev.github.io', base: '/retested', trailingSlash: 'always', integrations: [sitemap()] });
