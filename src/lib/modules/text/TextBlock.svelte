<script lang="ts">
	import type { TextData } from './TextData.js';

	let { data = $bindable() }: { data: TextData } = $props();
</script>

<div class="relative">
	<div class="w-full flex-1 border-none outline-none" contenteditable bind:innerText={data}></div>
	{#key data}
		{#if data.length === 0 || data === '\n'}
			<div class="pointer-events-none absolute left-0 top-0 text-surface-400">Type text</div>
		{/if}
	{/key}
</div>
