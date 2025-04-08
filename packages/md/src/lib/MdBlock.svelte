<script lang="ts">
	import type { MdData } from './MdData';
	import remarkParse from 'remark-parse';
	import remarkRehype from 'remark-rehype';
	import rehypeSanitize from 'rehype-sanitize';
	import rehypeStringify from 'rehype-stringify';
	import { unified } from 'unified';

	import remarkGfm from 'remark-gfm';
	import rehypeMathjax from 'rehype-mathjax';
	import remarkMath from 'remark-math';
	import CodeMirror from 'svelte-codemirror-editor';
	import { markdown } from '@codemirror/lang-markdown';

	import {
		defaultHighlightStyle,
		LanguageSupport,
		StreamLanguage,
		syntaxHighlighting
	} from '@codemirror/language';
	import rehypeCodeMirrorHighlight from './CodeMirrorMarkdownHighlighter';
	import rehypeRaw from 'rehype-raw';
	import { parseMathIPython } from './MarkdownTexParser';
	import { stex, stexMath } from '@codemirror/legacy-modes/mode/stex';
	import { getLanguage, type ExoInstance } from '@exomatique_editor/base';

	let {
		data = $bindable(),
		onchange,
		edition,
		instance,
		id,
		index,
		editable
	}: {
		data: MdData;
		onchange: (v: string) => void;
		edition: boolean;
		instance: ExoInstance;
		id: string;
		index: number;
		editable: boolean;
	} = $props();

	let html_data = $state('');

	const html_data_updater = async (data: string) => {
		return await unified()
			.use(remarkParse)
			.use(remarkMath)
			.use(remarkGfm)
			.use(remarkRehype, { allowDangerousHtml: true })
			.use(rehypeSanitize)
			.use(rehypeMathjax)
			.use(rehypeRaw)
			.use(rehypeCodeMirrorHighlight)
			.use(rehypeSanitize)
			.use(rehypeMathjax)
			.use(rehypeStringify, { allowDangerousHtml: true })
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
		if (edition && (document.getElementById(id)?.getElementsByClassName('cm-content')[0] as any)) {
			(document.getElementById(id)?.getElementsByClassName('cm-content')[0] as any).focus();
		}
	});
</script>

<div
	role="none"
	class="relative"
	onkeydown={(e) => {
		if (!edition) return;
		if (e.key === '/' && data.length == 0) {
			e.preventDefault();

			(
				document.getElementsByClassName('block_adder_snipper')[0].parentElement as HTMLButtonElement
			).click();
		}
	}}
>
	{#if edition}
		<CodeMirror
			lang={markdown({
				extensions: [parseMathIPython(StreamLanguage.define(stexMath).parser)],
				codeLanguages(info) {
					return getLanguage(info) || null;
				}
			})}
			lineWrapping={true}
			extensions={[syntaxHighlighting(defaultHighlightStyle, { fallback: true })]}
			basic={false}
			bind:value={data}
		/>
	{:else}
		<div
			class="markdown-content prose lg:prose-xl max-w-full flex-1 cursor-text border-none p-0 outline-none"
			tabindex="-1"
		>
			{#if data.trim().length === 0}
				<em class:invisible={!editable}>Insert markdown text here</em>
			{/if}
			{@html html_data}
		</div>
	{/if}
</div>

<style>
	:global(mjx-container:not([display='true'])) {
		vertical-align: middle;
		display: inline-block;
		margin: 0 0.1em;
	}

	:global(mjx-container[display='true']) {
		display: flex !important;
		justify-content: center;
		margin: 1em 0;
		text-align: center;
	}
</style>
