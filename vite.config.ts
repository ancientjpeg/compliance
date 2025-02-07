import { defineConfig } from 'vitest/config';
import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';

export default defineConfig({
	plugins: [sveltekit(), tailwindcss()],

	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	}
});
