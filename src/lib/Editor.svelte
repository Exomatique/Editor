<script lang="ts">
	import type ExoEditor from './ExoEditor.js';
	import type IExoModuleData from './IExoModuleData.js';
	import '@fortawesome/fontawesome-free/css/all.min.css';
	import ExoInstance from './ExoInstance.js';
	import BlockAdder from './BlockAdder.svelte';

	let { exo_editor }: { exo_editor: ExoEditor } = $props();
	let datas: IExoModuleData[] = $state([
		{
			type: exo_editor.default_module,
			data: exo_editor.modules[exo_editor.default_module].default_value(),
			id: crypto.randomUUID().replace('-', '_')
		}
	]);
	let focused = $state(-1);
	let edition = $state(-1);
	let hovered = $state(-1);
	let toolbar = $derived(focused === -1 ? hovered : focused);

	class ExoInstanceImpl extends ExoInstance {
		getEditor: () => ExoEditor = () => exo_editor;
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

	let container: HTMLElement;

	function handleFocusOut(event: any) {
		setTimeout(() => {
			if (!container.contains(document.activeElement)) {
				instance.setFocus(-1);
				instance.setHovered(-1);
			}
		}, 0);
	}

	let instance = new ExoInstanceImpl();
	let add_tooltip = $state(false);
</script>

<div
	bind:this={container}
	class="rounded-3x relative min-h-20 w-full bg-surface-50 py-10 text-body-color-dark shadow-2xl"
	tabindex="-1"
	role="none"
	onfocusout={(e) => {
		handleFocusOut(e);
	}}
>
	{#each instance.getBlocks().map((v, i) => {
		return { type: v.type, id: v.id, data: v.data, index: i };
	}) as v}
		{@const Component = instance.getEditor().modules[v.type].component}
		<div
			role="none"
			class={'exo_block relative flex-1 pe-5 ps-20'}
			id={'exo_block_' + v.id}
			onmouseenter={(e: any) => {
				instance.setHovered(v.index);
			}}
			onmouseleave={(e: any) => {
				if (!document.getElementById('toolbar')?.contains(e.relatedTarget)) instance.setHovered(-1);
			}}
			onfocusin={() => {
				instance.setFocus(v.index);
				instance.setEdition(v.index);
			}}
			onfocusout={(e: any) => {
				instance.setEdition(-1);
				if (!document.getElementById('toolbar')?.contains(e.relatedTarget))
					instance.setHovered(v.index);
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
			<Component
				data={v.data}
				index={v.index}
				datas={instance.getBlocks()}
				id={'exo_block_' + v.id}
				{instance}
				onchange={(value: any) => {
					datas[v.index].data = value;
					instance.setBlocks(datas);
				}}
				focused={focused === v.index}
				edition={edition === v.index}
			/>
		</div>
	{/each}

	{#if toolbar !== -1}
		<div
			role="none"
			tabindex="-1"
			class="absolute left-10"
			id="toolbar"
			style={'top: ' +
				(document.getElementById('exo_block_' + instance.getBlocks()[toolbar].id)?.offsetTop || 0) +
				'px'}
			onmouseenter={() => {
				instance.setHovered(toolbar);
			}}
			onmouseleave={(e: any) => {
				if (
					!document
						.getElementById('exo_block_' + instance.getBlocks()[toolbar].id)
						?.contains(e.relatedTarget)
				)
					instance.setHovered(-1);
			}}
			onfocusout={(e) => {
				e.stopPropagation();
			}}
		>
			<BlockAdder open={add_tooltip} {instance} index={toolbar} />
		</div>
	{/if}
</div>
