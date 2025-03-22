<script lang="ts">
	import Editor from '$lib/Editor.svelte';
	import ExoEditor from '$lib/ExoEditor.js';
	import type { ExoData } from '$lib/IExoModuleData';
	import type IExoModuleData from '$lib/IExoModuleData';
	import ContainerModule from '$lib/modules/container/ContainerModule';
	import MdModule from '$lib/modules/md/MdModule.js';
	import CorrectionModule from '../lib/modules/correction/CorrectionModule';
	import DefinitionModule from '../lib/modules/definition/DefinitionModule';
	import LatexModule from '../lib/modules/latex/LatexModule';
	import TheoremModule from '../lib/modules/theorem/TheoremModule';
	import VideoModule from '../lib/modules/video/VideoModule';

	const exo_editor = new ExoEditor({
		modules: [
			new MdModule(),
			new DefinitionModule(),
			new CorrectionModule(),
			new TheoremModule(),
			new LatexModule(),
			new VideoModule()
		],
		default_module: 'md'
	});

	let data: ExoData = $state([
		{ type: 'md', data: 'Bonjour ', id: '91a950d3_1c43_4529_bac6_bc4e5786471a' },
		{ type: 'md', data: 'Ceci est un test', id: '83911ad5_0519_4446_b07d_eba781a7322e' },
		{ type: 'md', data: '', id: '90b03865_7ba8_49e2_8157_ae031284ca2e' }
	]);

	let editable = $state(false);
</script>

<div class="relative flex h-full flex-1 justify-center">
	<div class="absolute h-full w-3/4 grow flex-row px-20 text-neutral-950 scheme-light">
		<Editor {editable} {exo_editor} bind:data />
	</div>
</div>

{#if editable}
	<button class="btn" onclick={() => (editable = false)}>View</button>
{:else}
	<button class="btn" onclick={() => (editable = true)}>Edit</button>
{/if}
