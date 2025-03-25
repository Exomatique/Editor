<script lang="ts">
	import type ExoInstance from '../../ExoInstance.js';
	import SemanticBlock from '../semantic/SemanticBlock.svelte';
	import type SemanticData from '../semantic/SemanticData.js';

	let {
		data = $bindable(),
		instance,
		index,
		id,
		editable,
		edition
	}: {
		data: SemanticData;
		instance: ExoInstance;
		index: number;
		id: string;
		editable: boolean;
		edition: boolean;
	} = $props();
</script>

<div class="semantic-correction">
	<SemanticBlock
		{editable}
		{edition}
		bind:blocks={data.blocks}
		bind:title={data.title}
		semantic_name={'Correction'}
		{id}
		{index}
		{instance}
	/>
</div>

<style>
	:global(.semantic-correction .title-block) {
		--tw-bg-opacity: 1;
		background-color: rgb(74 222 128 / var(--tw-bg-opacity, 1));
	}

	:global(.semantic-definition) {
		--tw-bg-opacity: 1;
		color: white;
	}

	:global(.semantic-correction .semantic-content) {
		--tw-bg-opacity: 1;
		color: black;
		border-color: rgb(74 222 128 / var(--tw-bg-opacity, 1));
		background-color: rgb(187 247 2084 / var(--tw-bg-opacity, 1)) /* #bfdbfe */;
	}
</style>
