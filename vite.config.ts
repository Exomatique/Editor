import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';
import { vite as vidstack } from 'vidstack/plugins';

export default defineConfig({
	plugins: [vidstack(), tailwindcss(), sveltekit()],
	optimizeDeps: {
		esbuildOptions: {
			loader: {
				'.keep': 'empty'
			}
		}
	}
});
