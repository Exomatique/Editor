<script lang="ts">
	import { Container, type ExoInstance } from '@exomatique_editor/base';
	import type SemanticModule from './SemanticModule';
	import {
		buildVariant,
		fieldToValue,
		type SemanticData,
		type SemanticVariant
	} from './SemanticModule';

	let {
		data = $bindable(),
		edition,
		instance,
		id,
		editable,
		index,
		module
	}: {
		data: SemanticData;
		onchange: (v: string) => void;
		module: SemanticModule;
		edition: boolean;
		instance: ExoInstance;
		id: string;
		index: number;
		editable: boolean;
	} = $props();

	let blocks = $derived(data.content);
	let preset = $derived(module.variants.find((v) => v.name === data.preset) as SemanticVariant);
	let spoilerMode = $derived(
		data.spoiler || (preset.spoiler?.type === 'static' && preset.spoiler.value)
	);
	let collasped_button = $state(!editable);
	let collasped = $derived(collasped_button && spoilerMode);

	let data_popuplated = $derived({
		prefix: fieldToValue(preset.prefix, data.prefix) as string,
		title: fieldToValue(preset.title, data.title) as string,
		baseColor: fieldToValue(preset.baseColor, data.baseColor) as string,
		spoiler: fieldToValue(preset.spoiler, data.spoiler) as boolean,
		content: []
	});

	$effect(() => {
		if (blocks.length === 0) {
			data.content = [instance.getEditor().buildBlock(instance.getEditor().default_module)];
		}
	});

	$effect(() => {
		if (
			edition &&
			document.getElementById(id) &&
			document.getElementById(id)?.getElementsByClassName('editable').length != 0 &&
			instance.getToEditionType() == 'NavigationDown'
		) {
			(document.getElementById(id)?.getElementsByClassName('editable')[0] as any).focus();
		}

		if (edition && instance.getToEditionType() === 'NavigationUp') {
			edit_box = true;
			if (collasped) {
				(document.getElementById(id)?.getElementsByClassName('editable')[0] as any).focus();
			} else {
				child_instance?.setFocus(child_instance.getBlocks().length - 1);
				child_instance?.setEdition(child_instance.getBlocks().length - 1);
			}
		}
	});

	let input_focused = $state(false);
	let edit_box = $state(false);

	let child_instance: ExoInstance | undefined = $state();

	function shadeColor(color: string, percent: number) {
		// https://stackoverflow.com/questions/5560248/programmatically-lighten-or-darken-a-hex-color-or-rgb-and-blend-colors
		let R = parseInt(color.substring(1, 3), 16);
		let G = parseInt(color.substring(3, 5), 16);
		let B = parseInt(color.substring(5, 7), 16);

		R = Math.round(Math.min((R * (100 + percent)) / 100, 255));
		G = Math.round(Math.min((G * (100 + percent)) / 100, 255));
		B = Math.round(Math.min((B * (100 + percent)) / 100, 255));

		var RR = R.toString(16).length == 1 ? '0' + R.toString(16) : R.toString(16);
		var GG = G.toString(16).length == 1 ? '0' + G.toString(16) : G.toString(16);
		var BB = B.toString(16).length == 1 ? '0' + B.toString(16) : B.toString(16);

		return '#' + RR + GG + BB;
	}

	let border_color = $derived(shadeColor(data_popuplated.baseColor, -20));
	let prefix_color = $derived(shadeColor(data_popuplated.baseColor, 0));
	let prefix_text = $derived('white');
</script>

<div class="relative mx-20 my-2 flex flex-1 flex-col">
	{#if editable || spoilerMode || data_popuplated.prefix?.trim().length !== 0 || data_popuplated.title?.trim().length !== 0}
		<div
			class={'flex w-full flex-1 flex-row items-center rounded-t-lg border-t-2 border-r-2 border-l-2'}
			class:border-b-2={collasped}
			class:rounded-b-lg={collasped}
			style={`border-color: ${border_color}; ${preset.title?.type === 'none' && preset.prefix?.type !== 'none' ? `background-color: ${prefix_color}` : ''}`}
		>
			{#if editable || data_popuplated.prefix?.trim().length !== 0}
				<div
					class="flex flex-row items-center self-start rounded-tl rounded-r-md px-4 py-2 font-bold select-none"
					style={`background-color: ${prefix_color}; color: ${prefix_text};`}
				>
					{#if preset.prefix?.type === 'editable' && editable}
						<div class="min-w-20 outline-none" contenteditable bind:innerText={data.prefix}></div>
					{:else if (preset.prefix?.type === 'static' || (preset.prefix?.type === 'editable' && !editable)) && data_popuplated.prefix?.trim() !== ''}
						<div>
							{data_popuplated.prefix}
						</div>
					{/if}

					{#if preset.baseColor?.type === 'editable' && editable}
						<input
							class="mx-2 h-5 w-5 rounded-lg border-2 border-white"
							type="color"
							bind:value={data.baseColor}
						/>
					{/if}
				</div>
			{/if}

			{#if preset.title?.type === 'editable' && editable}
				<div
					role="none"
					onkeydown={(e) => {
						if (editable && e.key === 'ArrowDown' && e.ctrlKey && child_instance) {
							edit_box = true;
							child_instance?.setFocus(0);
							child_instance?.setEdition(0);
						}
					}}
					contenteditable
					bind:focused={input_focused}
					bind:innerText={data.title}
					class="editable my-2 ms-2 flex-1 px-2 text-wrap outline-none"
				></div>
			{:else if (preset.title?.type === 'static' || (preset.title?.type === 'editable' && !editable)) && data_popuplated.title?.trim() !== ''}
				<div class="my-2 ms-2 flex-1 px-2 text-wrap outline-none">
					{data_popuplated.title}
				</div>
			{/if}

			{#if spoilerMode}
				{#if data_popuplated.title?.trim() === ''}
					<div class="flex-1"></div>
				{/if}
				<button
					aria-label="collapser"
					class="self-start rounded-tr-md px-4 py-2"
					onclick={() => (collasped_button = !collasped_button)}
				>
					<i class={`fa-solid ${collasped ? 'fa-angle-down' : 'fa-angle-up'}`}></i>
				</button>
			{/if}
			{#if editable && preset.spoiler?.type === 'editable'}
				<label for="collapsemode">Spoiler :</label>
				<input
					id="collapsemode"
					type="checkbox"
					class="bg-surface-400 mx-2 rounded-lg p-1"
					bind:checked={data.spoiler}
				/>
			{/if}
		</div>
	{/if}

	{#if !collasped}
		<div
			role="none"
			class={'semantic-content flex-1 rounded-b-lg border-2  px-2 py-2 pt-4 '}
			class:rounded-t-lg={!(
				editable ||
				spoilerMode ||
				data_popuplated.prefix?.trim().length !== 0 ||
				data_popuplated.title?.trim().length !== 0
			)}
			style={`border-color: ${border_color};`}
			onkeydown={(e) => {
				if (editable && e.key === 'ArrowUp' && e.ctrlKey && child_instance) {
					child_instance?.setFocus(-1);
					child_instance?.setEdition(-1);
					(document.getElementById(id)?.getElementsByClassName('editable')[0] as any).focus();
					edit_box = false;
					e.preventDefault();
					e.stopPropagation();
				}
			}}
		>
			<Container
				bind:data={data.content}
				{instance}
				{id}
				{index}
				bind:child_instance
				edition={input_focused && !edit_box}
				{editable}
				onchange={(v) => {
					data.content = v;
				}}
			/>
		</div>
	{/if}
</div>

<style>
	input[type='color']::-moz-color-swatch {
		border: transparent;
	}
</style>
