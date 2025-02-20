<script lang="ts">
	import type { TextData } from './TextData.js';
	import remarkParse from 'remark-parse';
	import remarkRehype from 'remark-rehype';
	import rehypeSanitize from 'rehype-sanitize';
	import rehypeStringify from 'rehype-stringify';
	import { unified } from 'unified';

	let { data = $bindable() }: { data: TextData } = $props();

	let html_data = $state('');

	const html_data_updater = async (data: string) => {
		return await unified()
			.use(remarkParse)
			.use(remarkRehype)
			.use(rehypeSanitize)
			.use(rehypeStringify)
			.process(data)
			.then(String);
	};

	let focused = $state(false);

	$effect(() => {
		html_data_updater(data).then((v) => {
			html_data = v;
			console.log(html_data);
		});
	});
</script>

<div class="relative" onfocusin={() => (focused = true)} onfocusout={() => (focused = false)}>
	{#if focused}
		<div class="w-full flex-1 outline-none" contenteditable bind:innerText={data}></div>
	{:else}
		<div class="min-h-5 w-full flex-1 border-none outline-none" contenteditable>
			{@html html_data}
		</div>
	{/if}
	{#key data}
		{#if !focused && (data.length === 0 || data === '\n')}
			<div class="pointer-events-none absolute left-0 top-0 text-surface-400">Type text</div>
		{/if}
	{/key}
</div>
