// @ts-check
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';

export default defineConfig({
	output: 'server',
	adapter: vercel(),
	site: 'https://proveedores.downlabs.mx',
	vite: {
		plugins: [tailwindcss()],
	},
});
