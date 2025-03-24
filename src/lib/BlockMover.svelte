<script lang="ts">
	import { Popover } from '@skeletonlabs/skeleton-svelte';
	import type ExoInstance from './ExoInstance.js';
	import BlockSelector from './BlockSelector.svelte';

	let { instance, index }: { open: boolean; instance: ExoInstance; index: number } = $props();
</script>

<Popover
	positioning={{ placement: 'top' }}
	triggerBase="hover:bg-surface-100 ignore-focus px-2 rounded-lg"
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
				class="btn bg-surface-200 hover:bg-surface-50 flex w-2xs flex-row items-center justify-start"
				disabled={index == 0}
				onclick={() => instance.moveUp(index)}
			>
				<p class="flex-1 text-left">
					<i class="fa-solid fa-arrow-up"></i> Move Up
				</p>
				<p class="text-surface-50">Ctrl + Shift + ⇑</p>
			</button>

			<button
				class="btn bg-surface-200 hover:bg-surface-50 flex w-2xs flex-row items-center justify-start"
				onclick={() => instance.delete(index)}
			>
				<p class="flex-1 text-left">
					<i class="fa-solid fa-x"></i> Delete
				</p>
				<p class="text-surface-50">Ctrl + Shift + Delete</p>
			</button>

			<button
				class="btn bg-surface-200 hover:bg-surface-50 flex w-2xs flex-row items-center justify-start"
				disabled={index == instance.getBlocks().length - 1}
				onclick={() => instance.moveDown(index)}
			>
				<p class="flex-1 text-left">
					<i class="fa-solid fa-arrow-down"></i> Move Down
				</p>
				<p class="text-surface-50">Ctrl + Shift + ⇓</p>
			</button>
		</div>
	{/snippet}
</Popover>
