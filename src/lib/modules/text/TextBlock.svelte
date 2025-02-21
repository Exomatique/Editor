<script lang="ts">
	import type { TextData } from './TextData.js';
	import remarkParse from 'remark-parse';
	import remarkRehype from 'remark-rehype';
	import rehypeSanitize from 'rehype-sanitize';
	import rehypeStringify from 'rehype-stringify';
	import { unified } from 'unified';
	import type ExoInstance from '../../ExoInstance.js';

	let {
		data = $bindable(),
		onchange,
		focused,
		instance,
		index
	}: {
		data: TextData;
		onchange: (v: string) => void;
		focused: boolean;
		instance: ExoInstance;
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
		if (focused)
			(
				document.getElementById('exo_block_' + index)?.getElementsByClassName('editable')[0] as any
			).focus();
	});
</script>

<div class="relative">
	{#if focused}
		<div
			role="none"
			class="editable w-full flex-1 outline-none"
			contenteditable
			bind:innerText={data}
			onkeydown={(e) => {
				if (e.key === 'Enter' && !e.shiftKey) {
					instance.insertBlockAt(
						{ type: 'text', data: instance.getEditor().modules['text'].default_value() },
						index + 1
					);
					instance.setFocus(index + 1);
					e.preventDefault();
				} else if (e.key === 'ArrowDown') {
					const line = window.getSelection()?.getRangeAt(0).startContainer;
					if (!line?.nextSibling || e.ctrlKey) instance.setFocus(instance.getFocus() + 1);
				} else if (e.key === 'ArrowUp') {
					const line = window.getSelection()?.getRangeAt(0).startContainer;
					if (!line?.previousSibling || e.ctrlKey) instance.setFocus(instance.getFocus() - 1);
				}
			}}
		></div>
	{:else}
		<div class="min-h-5 w-full flex-1 border-none outline-none" contenteditable>
			{@html html_data}
		</div>
	{/if}
	{#key data}
		{#if focused && (data.length === 0 || data === '\n')}
			<div class="pointer-events-none absolute left-0 top-0 text-surface-400">Type text</div>
		{/if}
	{/key}
</div>
