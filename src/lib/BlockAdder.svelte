<script lang="ts">
	import { Popover } from '@skeletonlabs/skeleton-svelte';
	import type ExoInstance from './ExoInstance.js';

	let {
		open = $bindable(),
		instance,
		index
	}: { open: boolean; instance: ExoInstance; index: number } = $props();

	let filter = $state('');
</script>

<Popover
	bind:open
	positioning={{ placement: 'top' }}
	triggerBase="preset-tonal px-2 rounded-lg"
	contentBase="flex flex-col relative rounded-lg border-2 border-surface-300 bg-surface-50 p-2"
	arrow
	arrowBackground="!bg-surface-200 dark:!bg-surface-800"
	onclick={() => {
		setTimeout(() => {
			instance.setFocus(index);
		});
	}}
>
	{#snippet trigger()}<i class="fa-solid fa-plus"></i>{/snippet}
	{#snippet content()}
		<div class="m-2 rounded-lg bg-surface-100 p-1">
			<i class="fa-solid fa-magnifying-glass mx-2"></i>
			<input class="bg-surface-100 outline-none" bind:value={filter} />
		</div>
		<div class="flex flex-1 flex-col gap-2">
			{#each Object.keys(instance.getEditor().modules).filter((v) => instance
					.getEditor()
					.modules[v].name.toLowerCase()
					.startsWith(filter.toLowerCase())) as k}
				<button
					class="m-1 flex flex-1 flex-row items-center gap-5 rounded-lg px-4 hover:bg-surface-100"
					onclick={() => {
						instance.insertBlockAt(
							{
								type: k,
								data: instance.getEditor().modules[k].default_value()
							},
							index + 1
						);
						instance.setFocus(index + 1);
					}}
				>
					{@html instance.getEditor().modules[k].icon}
					{instance.getEditor().modules[k].name}
				</button>
			{/each}
		</div>
	{/snippet}
</Popover>
