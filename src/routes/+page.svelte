<script lang="ts">
	import Editor from '$lib/Editor.svelte';
	import ExoEditor from '$lib/ExoEditor.js';
	import type { ExoData } from '$lib/IExoModuleData';
	import type IExoModuleData from '$lib/IExoModuleData';
	import ContainerModule from '$lib/modules/container/ContainerModule';
	import MdModule from '$lib/modules/md/MdModule.js';
	import TextModule from '$lib/modules/text/TextModule';

	const exo_editor = new ExoEditor({
		modules: [new MdModule(), new ContainerModule()],
		default_module: 'md'
	});

	let data: ExoData = $state([]);
</script>

<div class="relative flex w-full flex-1 flex-row justify-center">
	<div class="absolute h-full w-3/4 flex-1 flex-row">
		<Editor {exo_editor} bind:data />
	</div>
</div>
