<script lang="ts">
	import BlockAdder from '../../BlockAdder.svelte';
	import type ExoEditor from '../../ExoEditor';
	import ExoInstance from '../../ExoInstance';
	import type IExoModuleData from '../../IExoModuleData';
	import type { ContainerData } from './ContainerData';

	let {
		data: datas = $bindable(),
		instance: parent_instance,
		onchange: parent_onchange,
		id: parent_id,
		index
	}: {
		data: ContainerData;
		id: string;
		instance: ExoInstance;
		index: number;
		onchange: (v: ContainerData) => void;
	} = $props();

	let focused = $state(-1);
	let edition = $state(-1);
	let hovered = $state(-1);
	let toolbar = $derived(
		focused === -1
			? parent_instance.getFocus() === index || parent_instance.getFocus() === -1
				? hovered
				: -1
			: focused
	);

	class ExoInstanceImpl extends ExoInstance {
		getEditor: () => ExoEditor = parent_instance.getEditor;
		getBlocks: () => IExoModuleData[] = () => datas;
		setBlocks: (blocks: IExoModuleData[]) => void = (blocks) => {
			datas = blocks;
		};
		getFocus: () => number = () => focused;
		setFocus: (v: number) => void = (v) => {
			focused = v >= this.getBlocks().length ? this.getBlocks().length - 1 : v;
			if (focused !== edition) edition = -1;
		};
		getEdition: () => number = () => edition;
		setEdition: (v: number) => void = (v) => {
			if (this.getFocus() !== v) {
				focused = v >= this.getBlocks().length ? this.getBlocks().length - 1 : v;
			}
			edition = v >= this.getBlocks().length ? this.getBlocks().length - 1 : v;
		};
		getHovered: () => number = () => hovered;
		setHovered: (v: number) => void = (v) => {
			hovered = v >= this.getBlocks().length ? this.getBlocks().length - 1 : v;
		};
	}

	const instance = new ExoInstanceImpl();
	let add_tooltip = $state(false);
</script>

<div role="none">
	{#each instance.getBlocks().map((v, i) => {
		return { type: v.type, id: v.id, data: v.data, index: i };
	}) as v}
		{@const module = instance.getEditor().modules[v.type]}
		{@const Component = instance.getEditor().modules[v.type].component}
		<div
			role="none"
			class={'exo_block relative flex-1' + (!module.container ? ' ps-20 pe-5' : '')}
			id={'exo_block_' + v.id}
			onmouseenter={(e: any) => {
				instance.setHovered(v.index);
			}}
			onmouseleave={(e: any) => {
				if (
					!Array(...document.getElementsByClassName('ignore-focus')).find((v) =>
						v.contains(e.relatedTarget)
					)
				)
					instance.setHovered(-1);
			}}
			onfocusin={() => {
				instance.setFocus(v.index);
				instance.setEdition(v.index);
			}}
			onfocusout={(e: any) => {
				instance.setEdition(-1);
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
				e.stopPropagation();
			}}
		>
			<Component
				bind:data={datas[v.index].data}
				index={v.index}
				datas={instance.getBlocks()}
				id={'exo_block_' + v.id}
				{instance}
				onchange={(value: any) => {
					datas[v.index].data = value;
					instance.setBlocks(datas);
					parent_onchange(datas);
				}}
				focused={focused === v.index}
				edition={edition === v.index}
			/>
		</div>
	{/each}
</div>

{#if toolbar !== -1}
	{@const module = instance.getEditor().modules[instance.getBlocks()[toolbar]?.type]}
	<div
		role="none"
		tabindex="-1"
		class="absolute left-10"
		id="toolbar ignore-focus"
		style={'top: ' +
			(document.getElementById('exo_block_' + instance.getBlocks()[toolbar].id)?.offsetTop || 0) +
			'px'}
		onmouseenter={() => {
			instance.setHovered(toolbar);
			parent_instance.setHovered(-1);
		}}
		onmouseleave={(e: any) => {
			const id = instance.getBlocks()[toolbar]?.id;
			if (id && !document.getElementById('exo_block_' + id)?.contains(e.relatedTarget))
				instance.setHovered(-1);
			parent_instance.setHovered(index);
		}}
		onfocusin={() => {
			instance.setFocus(toolbar);
		}}
		onfocusout={(e) => {
			e.stopPropagation();
		}}
	>
		<BlockAdder open={add_tooltip} {instance} index={toolbar} />
	</div>
{/if}
