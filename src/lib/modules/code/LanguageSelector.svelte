<script lang="ts">
	import { onMount } from 'svelte';
	import type ExoInstance from '../../ExoInstance';
	import { getSupportedLanguages } from './LanguageSupport';
	import { LanguageDescription } from '@codemirror/language';

	let {
		filter = $bindable(''),
		onclick,
		onchoice
	}: {
		filter?: string;
		onclick?: () => void;
		onchoice?: (lang: LanguageDescription) => void;
	} = $props();

	let inputEl: HTMLInputElement;
	let select: number = $state(-1);
	let filtered = $derived(
		getSupportedLanguages().filter((description) => {
			return Array(...description.alias, description.name).find((v) =>
				v.toLowerCase().startsWith(filter.toLowerCase())
			);
		})
	);

	function onChoice(choice_index: number) {
		if (onchoice) onchoice(filtered[choice_index]);
		if (onclick) onclick();
	}

	let previously_editing: number;

	onMount(() => {
		setTimeout(() => inputEl.focus());
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
			{k.name}
		</button>
	{/each}
</div>
