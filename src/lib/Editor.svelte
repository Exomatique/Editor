<script lang="ts">
	import { Popover } from '@skeletonlabs/skeleton-svelte';
	import type ExoEditor from './ExoEditor.js';
	import type IExoModuleData from './IExoModuleData.js';
	import '@fortawesome/fontawesome-free/css/all.min.css';

	let { exo_editor }: { exo_editor: ExoEditor } = $props();

	let datas: IExoModuleData[] = $state([{ type: 'text', data: '' }]);

	let hovered = $state(-1);
	let focused = $state(-1);
	let toolbar = $derived(focused === -1 ? hovered : focused);
	let add_tooltip = $state(false);

	// Module picker
	let filter = $state('');
</script>

<div
	class="rounded-3x relative min-h-20 w-full bg-surface-50 py-10 text-body-color-dark shadow-2xl"
>
	{#each datas.map((v, i) => {
		return { type: v.type, data: v.data, index: i };
	}) as v}
		{@const Component = exo_editor.modules[v.type].component}
		<div
			role="none"
			class="relative flex flex-row"
			onmouseenter={(e) => {
				hovered = v.index;
			}}
			onmouseleave={(e) => {
				hovered = -1;
			}}
		>
			<div class="me-5 flex w-20 justify-end">
				{#if toolbar === v.index}
					<Popover
						bind:open={add_tooltip}
						positioning={{ placement: 'top' }}
						triggerBase="preset-tonal px-2 rounded-lg"
						contentBase="flex flex-col relative rounded-lg border-2 border-surface-300 bg-surface-50 p-2"
						arrow
						arrowBackground="!bg-surface-200 dark:!bg-surface-800"
						onclick={() => (focused = v.index)}
					>
						{#snippet trigger()}<i class="fa-solid fa-plus"></i>{/snippet}
						{#snippet content()}
							<div class="m-2 rounded-lg bg-surface-100 p-1">
								<i class="fa-solid fa-magnifying-glass mx-2"></i>
								<input class="bg-surface-100 outline-none" bind:value={filter} />
							</div>
							<div class="flex flex-1 gap-2">
								{#each Object.keys(exo_editor.modules).filter((v) => exo_editor.modules[v].name
										.toLowerCase()
										.startsWith(filter.toLowerCase())) as k}
									<button
										class="m-2 flex flex-1 flex-row items-center gap-5 rounded-lg p-1 px-4 hover:bg-surface-100"
										onclick={() => {
											datas = datas.toSpliced(v.index + 1, 0, {
												type: k,
												data: exo_editor.modules[k].default_value()
											});
											focused = -1;
										}}
									>
										{@html exo_editor.modules[k].icon}
										{exo_editor.modules[k].name}
									</button>
								{/each}
							</div>
						{/snippet}
					</Popover>
				{/if}
			</div>
			<div
				data-block-index={v.index}
				data-type={v.type}
				role="none"
				id={'exo_block_' + v.index}
				class="exo_block flex-1"
				onfocusin={() => (focused = v.index)}
				onfocusout={() => (focused = -1)}
				onkeydown={(e) => {
					if (e.key === 'Enter' && !e.shiftKey) {
						datas = datas.toSpliced(v.index + 1, 0, {
							type: 'text',
							data: exo_editor.modules['text'].default_value()
						});
						focused = v.index + 1;
						e.preventDefault();
					}
				}}
			>
				<Component
					data={v.data}
					index={v.index}
					{datas}
					onchange={(value: any) => {
						datas[v.index].data = value;
					}}
					focused={focused === v.index && !add_tooltip}
				/>
			</div>
		</div>
	{/each}
</div>
