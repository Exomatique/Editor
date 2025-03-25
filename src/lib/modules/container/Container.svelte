<script lang="ts">
	import { ssrExportAllKey } from 'vite/module-runner';
	import BlockAdder from '../../BlockAdder.svelte';
	import BlockMover from '../../BlockMover.svelte';
	import type ExoEditor from '../../ExoEditor';
	import ExoInstance from '../../ExoInstance';
	import type IExoModuleData from '../../IExoModuleData';
	import type { ContainerData } from './ContainerData';
	import { preventDefault } from 'svelte/legacy';

	let {
		data: datas = $bindable(),
		instance: parent_instance,
		onchange: parent_onchange,
		id: parent_id,
		editable,
		edition: parent_edition,
		child_instance = $bindable(),
		index
	}: {
		data: ContainerData;
		id: string;
		instance: ExoInstance;
		index: number;
		editable: boolean;
		edition: boolean;
		child_instance?: ExoInstance;
		onchange: (v: ContainerData) => void;
	} = $props();

	let focused = $state(-1);
	let edition = $state(
		parent_edition
			? parent_instance.getToEditionType() === 'Click'
				? -1
				: parent_instance.getToEditionType() === 'NavigationDown'
					? 0
					: datas.length - 1
			: -1
	);
	let hovered = $state(-1);
	let toolbar = $derived(
		editable
			? parent_instance.getFocus() === index || parent_instance.getFocus() === -1
				? focused === -1
					? hovered
					: focused
				: -1
			: -1
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
		getEdition: () => number = () => (editable ? edition : -1);
		setEdition: (v: number) => void = (v) => {
			edition = v >= this.getBlocks().length ? this.getBlocks().length - 1 : v;
		};
		getHovered: () => number = () => hovered;
		setHovered: (v: number) => void = (v) => {
			hovered = v >= this.getBlocks().length ? this.getBlocks().length - 1 : v;
		};
	}

	const instance = new ExoInstanceImpl();
	child_instance = instance;
	let add_tooltip = $state(false);
	let move_tooltip = $state(false);
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
				instance.setToEditionType('Click');
				instance.setEdition(v.index);
			}}
			onfocusout={(e: any) => {
				if (
					!document
						.getElementById('exo_block_' + instance.getBlocks()[v.index].id)
						?.contains(e.relatedTarget as any)
				)
					instance.setEdition(-1);
			}}
			onclick={(e) => {
				e.stopPropagation();
			}}
			onkeydown={(e) => {
				console.log(parent_id);
				if (editable && e.ctrlKey && e.shiftKey && e.key === 'ArrowDown') {
					instance.moveDown(instance.getFocus());
					e.preventDefault();
					e.stopPropagation();
				} else if (editable && e.ctrlKey && e.shiftKey && e.key === 'ArrowUp') {
					instance.moveUp(instance.getFocus());
					e.preventDefault();
					e.stopPropagation();
				} else if (editable && e.ctrlKey && e.shiftKey && e.key === 'Delete') {
					instance.delete(instance.getFocus());
					e.preventDefault();
					e.stopPropagation();
				} else if (editable && e.key === 'ArrowDown' && e.ctrlKey) {
					if (instance.getEdition() < instance.getBlocks().length - 1) {
						instance.setToEditionType('NavigationDown');
						instance.setEdition(instance.getEdition() + 1);
						e.stopPropagation();
					}
				} else if (editable && e.key === 'ArrowUp' && e.ctrlKey) {
					if (instance.getEdition() > 0) {
						instance.setToEditionType('NavigationUp');
						instance.setEdition(instance.getEdition() - 1);
						e.stopPropagation();
					}
				}
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
				{editable}
				focused={instance.getFocus() === v.index}
				edition={instance.getEdition() === v.index}
			/>
		</div>
	{/each}
</div>

{#if toolbar !== -1}
	{@const module = instance.getEditor().modules[instance.getBlocks()[toolbar]?.type]}
	{#key toolbar}
		<div
			role="none"
			tabindex="-1"
			class="absolute left-3 flex flex-row gap-1"
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
			<BlockMover open={move_tooltip} {instance} index={toolbar} />
		</div>
	{/key}
{/if}
