<script lang="ts">
	import type ExoInstance from '../../ExoInstance';
	import type IExoModuleData from '../../IExoModuleData';
	import Container from '../container/Container.svelte';

	let {
		title = $bindable(),
		blocks = $bindable(),
		semantic_name,
		instance,
		index,
		id,
		editable
	}: {
		semantic_name: string;
		title: string;
		blocks: IExoModuleData[];
		instance: ExoInstance;
		index: number;
		id: string;
		editable: boolean;
	} = $props();

	$effect(() => {
		if (blocks.length === 0) {
			blocks = [instance.getEditor().buildBlock(instance.getEditor().default_module)];
		}
	});
</script>

<div class="relative mx-20 my-2 flex flex-1 flex-col">
	<div class={'title-block flex w-full items-center rounded-t-lg px-2 py-2 '}>
		{semantic_name} :
		<div
			contenteditable
			bind:innerText={title}
			class="title-content ms-2 flex-1 outline-none"
		></div>
	</div>

	<div class={'semantic-content flex-1 rounded-b-lg border-2  px-2 py-2 pt-4 '}>
		<Container
			bind:data={blocks}
			{instance}
			{id}
			{index}
			{editable}
			onchange={(v) => {
				blocks = v;
			}}
		/>
	</div>
</div>
