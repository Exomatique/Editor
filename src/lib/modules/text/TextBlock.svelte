<script lang="ts">
	import type { TextData } from './TextData.js';

	let { data = $bindable() }: { data: TextData } = $props();
</script>

<div class="w-full flex-1 border-none outline-none" contenteditable bind:innerText={data}></div>
