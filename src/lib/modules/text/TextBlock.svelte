<script lang="ts">
	import type ExoInstance from '../../ExoInstance.js';
	import type { TextData } from './TextData.js';
	import { asRoot, BubbleMenu, Editor, Root } from 'typewriter-editor';

	let {
		data = $bindable(),
		onchange,
		edition,
		instance,
		index
	}: {
		data: TextData;
		onchange: (v: string) => void;
		edition: boolean;
		instance: ExoInstance;
		index: number;
	} = $props();
	const editor = new Editor();
</script>

<BubbleMenu {editor} let:active let:commands let:placement>
	<div class="menu flex flex-row gap-1 rounded-lg p-1 text-lg">
		<div data-arrow class="arrow {placement}"></div>
		<button class="menu-button" class:active={active.header === 1} onclick={commands.header1}
			>H1</button
		>

		<button class="menu-button" class:active={active.bold} onclick={commands.bold}>B</button>

		<button class="menu-button" class:active={active.italic} onclick={commands.italic}>I</button>
	</div>
</BubbleMenu>
<div class="rich-text outline-none" use:asRoot={editor}></div>

<style>
	.menu {
		background: rgb(var(--color-surface-600));
		color: rgb(var(--color-surface-50));
		/* ... */
	}
	.menu-button {
		background: rgb(var(--color-surface-800));
		border-radius: 0.5rem;
		padding: 2pt;
	}
	.arrow {
		display: block;
		border: 6px solid transparent;
	}
	.arrow.top {
		bottom: -12px;
		border-top-color: #000;
	}
	.arrow.bottom {
		top: -12px;
		border-bottom-color: #000;
	}
</style>
