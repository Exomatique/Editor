<script lang="ts">
	import type ExoEditor from './ExoEditor.js';
	import type IExoModuleData from './IExoModuleData.js';
	import '@fortawesome/fontawesome-free/css/all.min.css';
	import ExoInstance from './ExoInstance.js';
	import BlockAdder from './BlockAdder.svelte';
	import Container from './modules/container/Container.svelte';

	let { exo_editor: editor }: { exo_editor: ExoEditor } = $props();
	let datas: IExoModuleData[] = $state([editor.buildBlock(editor.modules[editor.default_module])]);
	let focused = $state(0);
	let edition = $state(-1);
	let hovered = $state(-1);

	class ExoInstanceImpl extends ExoInstance {
		getEditor: () => ExoEditor = () => editor;
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

	let instance = new ExoInstanceImpl();
</script>

<div
	class="rounded-3x relative min-h-20 w-full bg-surface-50 py-10 text-body-color-dark shadow-2xl"
	role="none"
>
	<Container data={datas} {instance} index={0} />
</div>
