<script lang="ts">
	import { Popover } from '@skeletonlabs/skeleton-svelte';
	import type ExoEditor from './ExoEditor.js';
	import type IExoModuleData from './IExoModuleData.js';
	import '@fortawesome/fontawesome-free/css/all.min.css';
	import ExoInstance from './ExoInstance.js';
	import BlockAdder from './BlockAdder.svelte';
	import { stopPropagation } from 'svelte/legacy';

	let { exo_editor }: { exo_editor: ExoEditor } = $props();
	let datas: IExoModuleData[] = $state([{ type: 'text', data: '' }]);
	let focused = $state(-1);
	let edition = $state(-1);

	class ExoInstanceImpl extends ExoInstance {
		getEditor: () => ExoEditor = () => exo_editor;
		getBlocks: () => IExoModuleData[] = () => datas;
		setBlocks: (blocks: IExoModuleData[]) => void = (blocks) => {
			datas = blocks;
		};
		getFocus: () => number = () => focused;
		setFocus: (v: number) => void = (v) => {
			focused = v >= datas.length ? datas.length - 1 : v < 0 ? 0 : v;
			if (focused !== edition) edition = -1;
		};
		getEdition: () => number = () => edition;
		setEdition: (v: number) => void = (v) => {
			if (this.getFocus() !== v) focused = v >= datas.length ? datas.length - 1 : v < 0 ? 0 : v;
			edition = v >= datas.length ? datas.length - 1 : v < 0 ? 0 : v;
		};
	}

	let instance = new ExoInstanceImpl();

	let hovered = $state(-1);
	let toolbar = $derived(focused === -1 ? hovered : focused);
	let add_tooltip = $state(false);

	$inspect('F', focused);
	$inspect('T', toolbar);
	$inspect('H', hovered);
</script>

<div
	class="rounded-3x relative min-h-20 w-full bg-surface-50 py-10 text-body-color-dark shadow-2xl"
	tabindex="-1"
	role="none"
	onclick={() => (focused = -1)}
>
	{#each datas.map((v, i) => {
		return { type: v.type, data: v.data, index: i };
	}) as v}
		{@const Component = exo_editor.modules[v.type].component}
		<div
			role="none"
			class={'relative flex flex-row'}
			onmouseenter={(e) => {
				hovered = v.index;
			}}
			onmouseleave={(e) => {
				hovered = -1;
			}}
			onfocusin={() => {
				focused = v.index;
			}}
			onclick={(e) => {
				e.stopPropagation();
			}}
			onkeydown={(e) => {
				if (e.key === 'ArrowDown' && e.ctrlKey) {
					instance.setEdition(instance.getEdition() + 1);
				} else if (e.key === 'ArrowUp' && e.ctrlKey) {
					instance.setEdition(instance.getEdition() - 1);
				}
			}}
		>
			<div class="me-5 flex w-20 justify-end">
				{#if toolbar === v.index}
					<BlockAdder open={add_tooltip} {instance} index={v.index} />
				{/if}
			</div>
			<div
				data-block-index={v.index}
				data-type={v.type}
				role="none"
				id={'exo_block_' + v.index}
				class="exo_block flex-1"
				onfocusin={() => {
					edition = v.index;
				}}
				onfocusout={() => {
					edition = -1;
				}}
			>
				<Component
					data={v.data}
					index={v.index}
					{instance}
					{datas}
					onchange={(value: any) => {
						datas[v.index].data = value;
					}}
					focused={focused === v.index}
					edition={edition === v.index}
				/>
			</div>
		</div>
	{/each}
</div>
