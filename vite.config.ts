import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';
import { esbuildCommonjs, viteCommonjs } from '@originjs/vite-plugin-commonjs';
import { isoImport } from 'vite-plugin-iso-import';

export default defineConfig({
	plugins: [sveltekit(), viteCommonjs({ exclude: ['html2pdf.js'] }), isoImport()],
	optimizeDeps: {
		esbuildOptions: {
			plugins: [esbuildCommonjs(['dicomjs'])]
		},
		include: ['dicomjs']
	},
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	}
});
