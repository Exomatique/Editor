<script lang="ts">
	import type ExoInstance from '../../ExoInstance.js';

	import { LanguageSupport } from '@codemirror/language';
	import type { CodeData } from './CodeData.js';
	import CodeMirror from 'svelte-codemirror-editor';
	import { getSupportedLanguages } from './LanguageSupport.js';
	import { onMount } from 'svelte';
	import LanguageSelector from './LanguageSelector.svelte';

	let {
		data = $bindable(),
		edition,
		id
	}: {
		data: CodeData;
		onchange: (v: string) => void;
		edition: boolean;
		instance: ExoInstance;
		id: string;
		index: number;
		editable: boolean;
	} = $props();

	let language: LanguageSupport | undefined = $state(undefined);

	$effect(() => {
		if (edition && (document.getElementById(id)?.getElementsByClassName('cm-content')[0] as any)) {
			(document.getElementById(id)?.getElementsByClassName('cm-content')[0] as any).focus();
		}
	});

	$effect(() => {
		const lang_key = data.lang;
		const languages = getSupportedLanguages();

		languages
			.find((v) => v.name.toLowerCase() === lang_key.toLowerCase())
			?.load()
			.then((v) => (language = v));
	});

	let open = $state(false);

	let filter = $state(data.lang);
	let selector: HTMLElement | undefined = $state(undefined);

	onMount(() => () => (open = false));
</script>

<div role="none" class="relative">
	<CodeMirror lang={language} readonly={!edition} basic={true} bind:value={data.content} />
	{#if edition}
		<button
			aria-label="block adder"
			class="hover:bg-surface-100 ignore-focus border-surface-100 mt-2 rounded-lg border-2 px-2"
			onclick={() => {
				open = true;
				filter = '';
			}}
		>
			{data.lang}
			<i class="block_adder_snipper fa-solid fa-caret-down"></i>
		</button>

		{#if open}
			<div
				bind:this={selector}
				role="none"
				class="border-surface-300 bg-surface-50 absolute z-50 flex flex-col rounded-lg border-2 p-2 text-neutral-950 scheme-light"
				onfocusout={(e) => {
					if (!e.relatedTarget || !selector?.contains(e.relatedTarget as any)) open = false;
				}}
				onkeydown={(e) => {
					if (e.key === 'Escape') open = false;
				}}
			>
				<LanguageSelector
					bind:filter
					onclick={() => (open = false)}
					onchoice={(lang) => {
						filter = lang.name;
						data.lang = lang.name;
					}}
				/>
			</div>
		{/if}
	{/if}
</div>
