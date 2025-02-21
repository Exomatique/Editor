<script lang="ts">
	import type { MdData } from './MdData.js';
	import remarkParse from 'remark-parse';
	import remarkRehype from 'remark-rehype';
	import rehypeSanitize from 'rehype-sanitize';
	import rehypeStringify from 'rehype-stringify';
	import { unified } from 'unified';
	import type ExoInstance from '../../ExoInstance.js';

	let {
		data = $bindable(),
		onchange,
		edition,
		instance,
		id,
		index
	}: {
		data: MdData;
		onchange: (v: string) => void;
		edition: boolean;
		instance: ExoInstance;
		id: string;
		index: number;
	} = $props();

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

	$effect(() => onchange(data));

	$effect(() => {
		html_data_updater(data).then((v) => {
			html_data = v;
		});
	});

	$effect(() => {
		if (edition)
			(document.getElementById(id)?.getElementsByClassName('editable')[0] as any).focus();
	});
</script>

<div class="relative">
	{#if edition}
		<div
			role="none"
			class="editable w-full flex-1 outline-none"
			contenteditable
			bind:innerText={data}
			onkeydown={(e) => {
				if (e.key === 'Enter' && !e.shiftKey) {
					instance.insertBlockAt(
						{
							type: 'md',
							data: instance.getEditor().modules['md'].default_value(),
							id: crypto.randomUUID().replace('-', '_')
						},
						index + 1
					);
					instance.setEdition(index + 1);
					e.preventDefault();
					e.stopPropagation();
				}
			}}
		></div>
	{:else}
		<div class="min-h-5 w-full flex-1 border-none outline-none" contenteditable>
			{@html html_data}
		</div>
	{/if}
	{#key data}
		{#if edition && (data.length === 0 || data === '\n')}
			<div class="pointer-events-none absolute left-0 top-0 text-surface-400">Type text</div>
		{/if}
	{/key}
</div>
