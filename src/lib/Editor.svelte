<script lang="ts">
	import type ExoEditor from './ExoEditor.js';
	import type IExoModuleData from './IExoModuleData.js';

	let { exo_editor }: { exo_editor: ExoEditor } = $props();

	let datas: IExoModuleData[] = [];

	let hovered = $state(-1);
</script>

<div
	class="rounded-3x relative min-h-20 w-full bg-surface-50 p-20 px-32 text-body-color-dark shadow-2xl"
>
	{#each datas.map((v, i) => {
		return { type: v.type, data: v.data, index: i };
	}) as v}
		{@const Component = exo_editor.modules[v.type].component}
		<div
			role="none"
			class="relative"
			onmouseenter={(e) => {
				hovered = v.index;
			}}
			onmouseleave={(e) => {
				hovered = -1;
			}}
		>
			{#if hovered === v.index}{/if}
			<Component data={v.data} index={v.index} {datas} />
		</div>
	{/each}
</div>
