<script lang="ts">
	import Editor from '$lib/Editor.svelte';
	import ExoEditor from '$lib/ExoEditor.js';
	import type { ExoData } from '$lib/IExoModuleData';
	import MdModule from '$lib/modules/md/MdModule.js';
	import { SemanticModule } from '../lib';
	import CodeModule from '../lib/modules/code/CodeModule';
	import LatexModule from '../lib/modules/latex/LatexModule';
	import VideoModule from '../lib/modules/video/VideoModule';

	const exo_editor = new ExoEditor({
		modules: [
			new MdModule(),
			new LatexModule(),
			new VideoModule(),
			new CodeModule(),
			new SemanticModule([
				{
					name: 'custom_box',
					baseColor: { type: 'editable', value: '#000000' },
					prefix: { type: 'editable', value: '' },
					spoiler: { type: 'editable', value: false },
					title: { type: 'editable', value: '' }
				},
				{
					name: 'definition',
					baseColor: { type: 'static', value: '#0000FF' },
					prefix: { type: 'static', value: 'Definition' },
					spoiler: { type: 'static', value: false },
					title: { type: 'editable', value: '' }
				}
			])
		],
		default_module: 'md'
	});

	let data: ExoData = $state([
		{ type: 'md', data: 'Bonjour ', id: '91a950d3_1c43_4529_bac6_bc4e5786471a' },
		{ type: 'md', data: 'Ceci est un test', id: '83911ad5_0519_4446_b07d_eba781a7322e' }
	]);

	let editable = $state(true);
</script>

{#key editable}
	<div class="relative flex h-full flex-1 justify-center">
		<div class="absolute h-full w-3/4 grow flex-row px-20 text-neutral-950 scheme-light">
			<Editor {editable} {exo_editor} bind:data />
		</div>
	</div>
{/key}

{#if editable}
	<button class="btn" onclick={() => (editable = false)}>View</button>
{:else}
	<button class="btn" onclick={() => (editable = true)}>Edit</button>
{/if}
