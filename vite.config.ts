import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';
import { vite as vidstack } from 'vidstack/plugins';
import { defineConfig } from 'vite';

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
