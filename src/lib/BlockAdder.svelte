<script lang="ts">
	import { Popover } from '@skeletonlabs/skeleton-svelte';
	import type ExoInstance from './ExoInstance.js';
	import BlockSelector from './BlockSelector.svelte';

	let {
		open = false,
		instance,
		index
	}: { open: boolean; instance: ExoInstance; index: number } = $props();

	let filter = $state('');
</script>

<Popover
	positioning={{ placement: 'top' }}
	triggerBase="ignore-focus preset-filled px-2 rounded-lg"
	contentBase="scheme-light text-neutral-950 flex flex-col relative rounded-lg border-2 border-surface-300 bg-surface-50 p-2"
	arrow
	arrowBackground="!bg-surface-200 dark:!bg-surface-800"
>
	{#snippet trigger()}<i class="fa-solid fa-plus"></i>{/snippet}
	{#snippet content()}
		<BlockSelector {instance} {index} {filter} onclick={() => (open = false)} />
	{/snippet}
</Popover>
