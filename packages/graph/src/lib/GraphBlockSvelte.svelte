<script lang="ts">
	import type { ExoInstance } from '@exomatique_editor/base';
	import type { GraphData } from './GraphModule';
	import CodeMirror from 'svelte-codemirror-editor';
	import { instance as vizJsInstance } from '@viz-js/viz';
	import { dot } from '@viz-js/lang-dot';

	let {
		data = $bindable(),
		onchange,
		edition,
		instance,
		id,
		index,
		editable
	}: {
		data: GraphData;
		onchange: (v: string) => void;
		edition: boolean;
		instance: ExoInstance;
		id: string;
		index: number;
		editable: boolean;
	} = $props();

	let html_data = $state('');
	let error = $state(false);

	$effect(() => {
		if (edition && (document.getElementById(id)?.getElementsByClassName('cm-content')[0] as any)) {
			(document.getElementById(id)?.getElementsByClassName('cm-content')[0] as any).focus();
		}
	});

	function updateSvg(input: string) {
		vizJsInstance()
			.then((v) => {
				html_data = v.renderSVGElement(input, { engine: 'dot', format: 'svg' }).outerHTML;
				html_data = html_data.replaceAll(
					'white',
					window.getComputedStyle(document.body).getPropertyValue('--color-surface-50')
				);
				error = false;
			})
			.catch((e) => {
				error = true;
			});
	}

	$effect(() => {
		updateSvg(data.graphiz_script);
	});
</script>

<div role="none" class="relative">
	{#if edition}
		<CodeMirror lang={dot()} lineWrapping={true} basic bind:value={data.graphiz_script} />
	{:else}
		<div
			class="markdown-content prose lg:prose-xl max-w-full flex-1 cursor-text border-none p-0 outline-none"
			tabindex="-1"
		>
			{#if data.graphiz_script.trim().length === 0}
				<em class:invisible={!editable}>Insert graphviz script here</em>
			{:else if error}
				<em
					class:invisible={!editable && error && data.graphiz_script.trim().length !== 0}
					class="text-red-600">Graphviz script is invalid</em
				>
			{/if}
			<div class="flex flex-1 justify-center">{@html html_data}</div>
		</div>
	{/if}
</div>
