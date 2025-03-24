<script lang="ts">
	import { onMount } from 'svelte';
	import type ExoInstance from './ExoInstance';

	let {
		filter = $bindable(''),
		instance,
		index,
		onclick
	}: { filter?: string; instance: ExoInstance; index: number; onclick?: () => void } = $props();

	let inputEl: HTMLInputElement;
	let select: number = $state(-1);
	let filtered = $derived(
		Object.keys(instance.getEditor().modules).filter((v) =>
			instance.getEditor().modules[v].name.toLowerCase().startsWith(filter.toLowerCase())
		)
	);

	function onChoice(choice_index: number) {
		if (previously_editing != -1) instance.delete(previously_editing);
		const editor = instance.getEditor();
		const block = editor.buildBlock(instance.getEditor().modules[filtered[choice_index]]);
		instance.insertBlockAt(block, index + 1);
		if (onclick) onclick();
		const copy_index = index;
		setTimeout(() => {
			instance.setFocus(copy_index + 1);
			instance.setEdition(copy_index + 1);
		}, 0);
	}

	let previously_editing: number;

	onMount(() => {
		previously_editing = instance.getEdition();
		setTimeout(() => inputEl.focus());
		return () => instance.setEdition(previously_editing);
	});

	let container: HTMLElement;
</script>

<div
	role="none"
	class="bg-surface-100 m-2 flex flex-row items-center rounded-lg p-1"
	onkeydown={(e) => {
		if (e.key === 'ArrowUp') {
			select = Math.max(select - 1, 0);
			container.children[select].scrollIntoView(false);
		} else if (e.key === 'ArrowDown') {
			select = Math.min(select + 1, filtered.length - 1);
			container.children[select].scrollIntoView(false);
		} else if (e.key === 'Enter' || e.key === 'Space') {
			onChoice(select);
		}
	}}
>
	<i class="fa-solid fa-magnifying-glass mx-2"></i>
	<input
		bind:this={inputEl}
		class="bg-surface-100 outline-none"
		bind:value={filter}
		onchange={() => (select = -1)}
	/>
</div>
<div bind:this={container} class="ignore-focus flex max-h-40 flex-1 flex-col overflow-scroll">
	{#each filtered.map((v, i) => ({ index: i, value: v })) as { index, value: k }}
		<button
			class="hover:bg-surface-100 m-1 flex flex-1 flex-row items-center gap-5 rounded-lg px-4"
			class:bg-surface-100={select === index}
			onclick={() => {
				onChoice(index);
			}}
			onmouseenter={() => {
				select = index;
			}}
			onmouseleave={() => {
				select = -1;
			}}
		>
			<div class="flex h-6 w-6 items-center justify-center">
				{@html instance.getEditor().modules[k].icon}
			</div>
			{instance.getEditor().modules[k].name}
		</button>
	{/each}
</div>
