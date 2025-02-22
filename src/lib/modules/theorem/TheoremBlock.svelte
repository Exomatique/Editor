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

<div class="semantic-theorem">
	<SemanticBlock
		bind:blocks={data.blocks}
		bind:title={data.title}
		semantic_name={'Theroem'}
		{id}
		{index}
		{instance}
	/>
</div>

<style>
	:global(.semantic-theorem .title-block) {
		--tw-bg-opacity: 1;
		background-color: rgb(248 113 113 / var(--tw-bg-opacity, 1));
	}

	:global(.semantic-theorem .title-content) {
		--tw-bg-opacity: 1;
		color: white;
	}

	:global(.semantic-theorem .semantic-content) {
		--tw-bg-opacity: 1;
		border-color: rgb(248 113 113 / var(--tw-bg-opacity, 1));
		background-color: rgb(254 202 202 / var(--tw-bg-opacity, 1)) /* #bfdbfe */;
	}
</style>
