<script>
	import Editor from '$lib/Editor.svelte';
	import ExoEditor from '$lib/ExoEditor.js';
	import MdModule from '$lib/modules/md/MdModule.js';

	const exo_editor = new ExoEditor({ modules: [new MdModule()] });
</script>

<div class="relative flex w-full flex-1 flex-row justify-center">
	<div class="absolute h-full w-3/4 flex-1 flex-row">
		<Editor {exo_editor} />
	</div>
</div>
