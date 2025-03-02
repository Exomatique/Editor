<script lang="ts">
	import type ExoInstance from '../../ExoInstance.js';
	import SemanticBlock from '../semantic/SemanticBlock.svelte';
	import type SemanticData from '../semantic/SemanticData.js';

	let {
		data = $bindable(),
		instance,
		index,
		id
	}: { data: SemanticData; instance: ExoInstance; index: number; id: string } = $props();
</script>

<div class="semantic-definition">
	<SemanticBlock
		bind:blocks={data.blocks}
		bind:title={data.title}
		semantic_name={'Definition'}
		{id}
		{index}
		{instance}
	/>
</div>

<style>
	:global(.semantic-definition .title-block) {
		--tw-bg-opacity: 1;
		background-color: rgb(59 130 246 / var(--tw-bg-opacity, 1));
	}

	:global(.semantic-definition) {
		--tw-bg-opacity: 1;
		color: white;
	}

	:global(.semantic-definition .semantic-content) {
		--tw-bg-opacity: 1;
		border-color: rgb(59 130 246 / var(--tw-bg-opacity, 1));
		background-color: rgb(191 219 254 / var(--tw-bg-opacity, 1)) /* #bfdbfe */;
	}
</style>
