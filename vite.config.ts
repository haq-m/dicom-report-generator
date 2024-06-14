import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';
import { esbuildCommonjs, viteCommonjs } from '@originjs/vite-plugin-commonjs';

export default defineConfig({
	plugins: [sveltekit(), viteCommonjs()],
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
