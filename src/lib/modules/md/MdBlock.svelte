<script lang="ts">
	// https://github.com/srsholmes/svelte-code-input
	import type { MdData } from './MdData.js';
	import remarkParse from 'remark-parse';
	import remarkRehype from 'remark-rehype';
	import rehypeSanitize from 'rehype-sanitize';
	import rehypeStringify from 'rehype-stringify';
	import { unified } from 'unified';
	import type ExoInstance from '../../ExoInstance.js';

	import hljs from 'highlight.js/lib/core';
	import markdown from 'highlight.js/lib/languages/markdown';
	import 'highlight.js/styles/github.css';
	import CodeInput from '../../CodeInput.svelte';
	import remarkGfm from 'remark-gfm';
	import rehypeMathjax from 'rehype-mathjax';
	import remarkMath from 'remark-math';
	import BlockAdder from '../../BlockAdder.svelte';
	import BlockSelector from '../../BlockSelector.svelte';
	import { Popover } from '@skeletonlabs/skeleton-svelte';

	hljs.registerLanguage('markdown', markdown);

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
			.use(remarkMath)
			.use(remarkGfm)
			.use(remarkRehype)
			.use(rehypeSanitize)
			.use(rehypeMathjax)
			.use(rehypeStringify)
			.process(data)
			.then((v) => {
				return v.value as string;
			});
	};

	$effect(() => {
		onchange(data);
	});

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
		<CodeInput
			autoHeight
			language={'markdown'}
			highlightjs={hljs}
			bind:value={data}
			onChange={() => {}}
			placeholder={' '}
			onkeydown={(e) => {
				if (e.key === 'Enter' && !e.shiftKey) {
					instance.insertAndBuildBlockAt('md', undefined, index + 1);
					instance.setEdition(index + 1);
					e.preventDefault();
					e.stopPropagation();
				} else if (e.key === '/' && data.length == 0) {
					e.preventDefault();

					(
						document.getElementsByClassName('block_adder_snipper')[0]
							.parentElement as HTMLButtonElement
					).click();
				}
			}}
		/>
	{:else}
		<div class="min-h-5 w-full flex-1 cursor-text border-none p-0 outline-none" tabindex="-1">
			{#if data.length === 0 || data === '\n'}
				<p class="invisible">Text for alignment</p>
			{/if}
			{@html html_data}
		</div>
	{/if}
	{#key data}
		{#if edition && (data.length === 0 || data === '\n')}
			<div class="pointer-events-none absolute top-0 left-0 opacity-40">Type text</div>
		{/if}
	{/key}
</div>

<style>
	:global(mjx-container) {
		display: inline-grid;
		overflow-x: auto;
		overflow-y: hidden;
		max-width: 100%;
	}
</style>
