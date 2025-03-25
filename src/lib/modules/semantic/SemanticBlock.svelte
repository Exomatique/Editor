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
		editable,
		edition
	}: {
		semantic_name: string;
		title: string;
		blocks: IExoModuleData[];
		instance: ExoInstance;
		index: number;
		id: string;
		editable: boolean;
		edition: boolean;
	} = $props();

	$effect(() => {
		if (blocks.length === 0) {
			blocks = [instance.getEditor().buildBlock(instance.getEditor().default_module)];
		}
	});

	$effect(() => {
		if (
			edition &&
			document.getElementById(id) &&
			document.getElementById(id)?.getElementsByClassName('editable').length != 0 &&
			instance.getToEditionType() == 'NavigationDown'
		) {
			(document.getElementById(id)?.getElementsByClassName('editable')[0] as any).focus();
		}

		if (edition && instance.getToEditionType() === 'NavigationUp') {
			edit_box = true;
			child_instance?.setFocus(child_instance.getBlocks().length - 1);
			child_instance?.setEdition(child_instance.getBlocks().length - 1);
		}
	});

	let input_focused = $state(false);
	let edit_box = $state(false);

	let child_instance: ExoInstance | undefined = $state();
</script>

<div class="relative mx-20 my-2 flex flex-1 flex-col">
	<div class={'title-block flex w-full items-center rounded-t-lg px-2 py-2 '}>
		{semantic_name} :
		<div
			role="none"
			onkeydown={(e) => {
				if (editable && e.key === 'ArrowDown' && e.ctrlKey && child_instance) {
					edit_box = true;
					child_instance?.setFocus(0);
					child_instance?.setEdition(0);
				}
			}}
			contenteditable
			bind:focused={input_focused}
			bind:innerText={title}
			class="title-content editable ms-2 flex-1 outline-none"
		></div>
	</div>

	<div role="none" class={'semantic-content flex-1 rounded-b-lg border-2  px-2 py-2 pt-4 '}>
		<Container
			bind:data={blocks}
			{instance}
			{id}
			{index}
			bind:child_instance
			edition={input_focused && !edit_box}
			{editable}
			onchange={(v) => {
				blocks = v;
			}}
		/>
	</div>
</div>
