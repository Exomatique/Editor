<script lang="ts">
	import type ExoInstance from './ExoInstance';

	let {
		filter = $bindable(),
		instance,
		index,
		onclick
	}: { filter: string; instance: ExoInstance; index: number; onclick?: () => void } = $props();
</script>

<div class="m-2 rounded-lg bg-surface-100 p-1">
	<i class="fa-solid fa-magnifying-glass mx-2"></i>
	<input class="bg-surface-100 outline-none" bind:value={filter} />
</div>
<div class="ignore-focus flex flex-1 flex-col gap-2">
	{#each Object.keys(instance.getEditor().modules).filter((v) => instance
			.getEditor()
			.modules[v].name.toLowerCase()
			.startsWith(filter.toLowerCase())) as k}
		<button
			class="m-1 flex flex-1 flex-row items-center gap-5 rounded-lg px-4 hover:bg-surface-100"
			onclick={() => {
				const editor = instance.getEditor();
				const block = editor.buildBlock(instance.getEditor().modules[k]);
				instance.insertBlockAt(block, index + 1);
				if (onclick) onclick();
				const copy_index = index;
				setTimeout(() => {
					instance.setFocus(copy_index + 1);
					instance.setEdition(copy_index + 1);
				}, 0);
			}}
		>
			{@html instance.getEditor().modules[k].icon}
			{instance.getEditor().modules[k].name}
		</button>
	{/each}
</div>
