import type { Config } from 'tailwindcss';

import { skeleton, contentPath } from '@skeletonlabs/skeleton/plugin';
import * as themes from '@skeletonlabs/skeleton/themes';
import typograhy from '@tailwindcss/typography';

export default {
	content: ['./src/**/*.{html,js,svelte,ts}', contentPath(import.meta.url, 'svelte')],
	theme: {
		extend: {}
	},
	plugins: [
		typograhy,
		skeleton({
			themes: [themes.cerberus]
		})
	],
	darkMode: 'selector'
} satisfies Config;
