<script lang="ts">
	import type { MdData } from './LatexData.js';
	import type ExoInstance from '../../ExoInstance.js';
	import { parse, HtmlGenerator } from 'latex.js';
	// Not used for now, prefers to use tailwind to have a common rendering with markdown
	// import './css/article.css';
	// import './css/book.css';
	// import './css/katex.css';
	// import './css/base.css';

	import hljs from 'highlight.js/lib/core';
	import 'highlight.js/styles/github.css';
	import latex from 'highlight.js/lib/languages/latex';
	import CodeInput from '../../CodeInput.svelte';
	hljs.registerLanguage('latex', latex);

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
		let generator = new HtmlGenerator({ hyphenate: false, styles: [] });
		let doc = parse(data, { generator: generator }).htmlDocument();
		const el: HTMLElement = doc.documentElement;
		Array(...el.getElementsByTagName('link')).forEach((v) => {
			if (v.rel === 'stylesheet') v.remove();
		});
		return el.outerHTML;
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

<div class="relative flex flex-1 flex-col">
	{#if edition}
		<CodeInput
			autoHeight
			language={'latex'}
			highlightjs={hljs}
			bind:value={data}
			onChange={() => {}}
			placeholder={' '}
		/>
	{:else}
		<div
			class="prose lg:prose-xl min-h-5 w-full flex-1 border-none outline-none"
			tabindex="-1"
			spellcheck="false"
		>
			{@html html_data}
		</div>
	{/if}
	{#key data}
		{#if edition && (data.length === 0 || data === '\n')}
			<div class="text-surface-400 pointer-events-none absolute top-0 left-0">Type text</div>
		{/if}
	{/key}
</div>

<style>
	:global(.katex-html) {
		display: none;
	}
</style>
