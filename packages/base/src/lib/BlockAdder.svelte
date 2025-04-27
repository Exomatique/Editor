<script lang="ts">
	import type ExoInstance from './ExoInstance.js';
	import { onMount } from 'svelte';
	import { BlockSelector } from './index.js';

	let {
		open = false,
		instance,
		index
	}: { open: boolean; instance: ExoInstance; index: number } = $props();

	let filter = $state('');
	let selector: HTMLElement | undefined = $state(undefined);
	let position: HTMLElement | undefined = $state(undefined);

	function close() {
		open = false;
		selector?.remove();
	}

	onMount(() => close);

	$effect(() => {
		if (open && selector) {
			document.body.append(selector);
			const rect = position?.getBoundingClientRect();
			if (!rect) return;

			selector.style.top = `${rect.y + window.scrollY}px`;
			selector.style.left = `${rect.x + window.scrollX}px`;
		}
	});
</script>

<button
	aria-label="block adder"
	class="hover:bg-surface-100 ignore-focus rounded-lg px-2"
	onclick={() => {
		open = !open;
	}}
>
	<i class="block_adder_snipper fa-solid fa-plus"></i>
</button>

<div bind:this={position}></div>
{#if open}
	<div
		bind:this={selector}
		role="none"
		class="border-surface-300 bg-surface-50 absolute z-50 flex flex-col rounded-lg border-2 p-2 text-neutral-950 scheme-light"
		onfocusout={(e) => {
			if (!e.relatedTarget || !selector?.contains(e.relatedTarget as any)) close();
		}}
		onkeydown={(e) => {
			if (e.key === 'Escape') {
				open = false;
				selector?.remove();
			}
		}}
	>
		<BlockSelector {instance} {index} {filter} onclick={close} />
	</div>
{/if}
