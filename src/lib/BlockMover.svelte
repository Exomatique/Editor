<script lang="ts">
	import { Popover } from '@skeletonlabs/skeleton-svelte';
	import type ExoInstance from './ExoInstance.js';
	import BlockSelector from './BlockSelector.svelte';

	let {
		open = false,
		instance,
		index
	}: { open: boolean; instance: ExoInstance; index: number } = $props();

	function onMoveUp() {
		let blocks = instance.getBlocks();

		let previous = blocks[index - 1];
		let current = blocks[index];

		instance.setBlocks(
			blocks.map((v, i) => {
				if (i === index) return previous;
				if (i === index - 1) return current;
				return v;
			})
		);

		instance.setFocus(index - 1);
	}

	function onDelete() {
		let blocks = instance.getBlocks();

		instance.setBlocks(blocks.filter((_, i) => i != index));
		if (index == blocks.length - 1) instance.setFocus(index - 1);
	}

	function onMoveDown() {
		let blocks = instance.getBlocks();

		let next = blocks[index + 1];
		let current = blocks[index];

		instance.setBlocks(
			blocks.map((v, i) => {
				if (i === index) return next;
				if (i === index + 1) return current;
				return v;
			})
		);

		instance.setFocus(index + 1);
	}

	let filter = $state('');
</script>

<Popover
	positioning={{ placement: 'top' }}
	triggerBase="ignore-focus preset-filled px-2 rounded-lg"
	contentBase="scheme-light text-neutral-950 flex flex-col relative rounded-lg border-2 border-surface-300 bg-surface-50 p-2"
	arrow
	arrowBackground="!bg-surface-200 dark:!bg-surface-800"
>
	{#snippet trigger()}
		<i class="fa-solid fa-ellipsis-vertical"></i><i class="fa-solid fa-ellipsis-vertical"
		></i>{/snippet}
	{#snippet content()}
		<div class="flex flex-col gap-5 scheme-light">
			<button
				class="btn bg-surface-200 hover:bg-surface-50"
				disabled={index == 0}
				onclick={onMoveUp}
			>
				<i class="fa-solid fa-arrow-up"></i> Move Up
			</button>

			<button class="btn bg-surface-200 hover:bg-surface-50" onclick={onDelete}>
				<i class="fa-solid fa-x"></i> Delete
			</button>

			<button
				class="btn bg-surface-200 hover:bg-surface-50"
				disabled={index == instance.getBlocks().length - 1}
				onclick={onMoveDown}
			>
				<i class="fa-solid fa-arrow-down"></i> Move Down
			</button>
		</div>
	{/snippet}
</Popover>
