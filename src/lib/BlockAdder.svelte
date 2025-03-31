<script lang="ts">
	import type ExoInstance from './ExoInstance.js';
	import BlockSelector from './BlockSelector.svelte';
	import { onMount } from 'svelte';

	let {
		open = false,
		instance,
		index
	}: { open: boolean; instance: ExoInstance; index: number } = $props();

	let filter = $state('');
	let selector: HTMLElement | undefined = $state(undefined);

	onMount(() => () => (open = false));
</script>

<button
	aria-label="block adder"
	class="hover:bg-surface-100 ignore-focus rounded-lg px-2"
	onclick={() => {
		open = true;
	}}
>
	<i class="block_adder_snipper fa-solid fa-plus"></i>
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
		<BlockSelector {instance} {index} {filter} onclick={() => (open = false)} />
	</div>
{/if}
