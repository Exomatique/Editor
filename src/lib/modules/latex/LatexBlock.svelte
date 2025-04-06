<script lang="ts">
	import type { MdData } from './LatexData';
	import type ExoInstance from '../../ExoInstance';
	import { parse, HtmlGenerator } from 'latex.js';

	import CodeMirror from 'svelte-codemirror-editor';
	import { EditorView } from '@codemirror/view';
	import { syntaxHighlighting, defaultHighlightStyle, StreamLanguage } from '@codemirror/language';
	import { stex } from '@codemirror/legacy-modes/mode/stex';
	// Not used for now, prefers to use tailwind to have a common rendering with markdown
	// import './css/article.css';
	// import './css/book.css';
	// import './css/katex.css';
	// import './css/base.css';

	let {
		data = $bindable(),
		onchange,
		edition,
		instance,
		id,
		editable,
		index
	}: {
		data: MdData;
		editable: boolean;
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

		Array(...el.getElementsByClassName('itemlabel')).forEach((v) => v.remove());
		Array();
		return el.outerHTML;
	};

	$effect(() => onchange(data));

	$effect(() => {
		html_data_updater(data).then((v) => {
			html_data = v;
		});
	});

	$effect(() => {
		if (edition && (document.getElementById(id)?.getElementsByClassName('cm-content')[0] as any)) {
			(document.getElementById(id)?.getElementsByClassName('cm-content')[0] as any).focus();
		}
	});
</script>

<div class="relative flex">
	{#if edition}
		<CodeMirror
			class="w-full"
			bind:value={data}
			extensions={[]}
			theme={[
				EditorView.contentAttributes.of({ spellcheck: 'true' }),
				EditorView.lineWrapping,
				StreamLanguage.define(stex),
				syntaxHighlighting(defaultHighlightStyle)
			]}
		/>
	{:else}
		<div
			class="latex-content prose lg:prose-xl w-full max-w-full flex-1 list-none border-none text-wrap outline-none"
			tabindex="-1"
			spellcheck="false"
		>
			{#if data.trim().length === 0 && editable}
				<em>Insert latex code here</em>
			{/if}
			{@html html_data}
		</div>
	{/if}
</div>

<style>
	:global(.katex-html) {
		display: none;
	}

	:global(.latex-content *) {
		text-wrap: wrap;
		word-wrap: break-word;
	}
</style>
