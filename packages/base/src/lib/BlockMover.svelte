<script lang="ts">
	import { Popover } from '@skeletonlabs/skeleton-svelte';
	import type ExoInstance from './ExoInstance.js';
	import { onMount } from 'svelte';

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
			selector.focus();
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
	<i class="fa-solid fa-ellipsis-vertical"></i><i class="fa-solid fa-ellipsis-vertical"></i>
</button>

<div bind:this={position}></div>
{#if open}
	<div
		bind:this={selector}
		role="none"
		tabindex="-1"
		class="border-surface-300 bg-surface-50 absolute z-50 flex flex-col rounded-lg border-2 p-2 text-neutral-950 scheme-light"
		onfocusout={(e) => {
			if (!e.relatedTarget || !selector?.contains(e.relatedTarget as any)) close();
		}}
		onkeydown={(e) => {
			if (e.key === 'Escape') close();
		}}
	>
		<div class="flex w-md flex-col gap-5 scheme-light">
			<button
				class="btn bg-surface-200 {index !== 0
					? 'hover:bg-surface-50'
					: 'disabled'} flex flex-row items-center justify-start"
				disabled={index == 0}
				onclick={() => instance.moveUp(index)}
			>
				<p class="flex-1 text-left">
					<i class="fa-solid fa-arrow-up"></i> Move Up
				</p>
				<p class="text-surface-50">Ctrl + Shift + ⇑</p>
			</button>

			<button
				class="btn bg-surface-200 hover:bg-surface-50 flex flex-row items-center justify-start"
				onclick={() => {
					instance.delete(index);
				}}
			>
				<p class="flex-1 text-left">
					<i class="fa-solid fa-x"></i> Delete
				</p>
				<p class="text-surface-50">Ctrl + Shift + Delete</p>
			</button>

			<button
				class="btn bg-surface-200 {index !== instance.getBlocks().length - 1
					? 'hover:bg-surface-50'
					: 'disabled'} flex flex-row items-center justify-start"
				disabled={index == instance.getBlocks().length - 1}
				onclick={() => instance.moveDown(index)}
			>
				<p class="flex-1 text-left">
					<i class="fa-solid fa-arrow-down"></i> Move Down
				</p>
				<p class="text-surface-50">Ctrl + Shift + ⇓</p>
			</button>
		</div>
	</div>
{/if}
