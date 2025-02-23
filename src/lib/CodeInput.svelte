<script lang="ts">
	// https://github.com/srsholmes/svelte-code-input/blob/develop/src/lib/CodeInput.svelte
	import { onMount } from 'svelte';

	let {
		highlightjs,
		value = $bindable(),
		language,
		onChange,
		placeholder,
		autoHeight,
		resize
	}: {
		resize?: 'horitzontal' | 'vertical' | 'none' | 'auto';
		highlightjs: any;
		value: string;
		language: string;
		onChange: (value: string) => void;
		placeholder?: string;
		autoHeight?: boolean;
	} = $props();

	let preElement: HTMLPreElement;
	let textAreaElement: HTMLTextAreaElement;
	let wrapperElement: HTMLDivElement;
	let outerElement: HTMLDivElement;

	// Used to detect when the user manually resizes the wrapper with handle
	let wrapperHeight: number;
	let wrapperWidth: number;

	let manualResize = false;
	let mounted = false;
	let codeTokens = $state('');

	onMount(async () => {
		if (textAreaElement === null) {
			mounted = false;
			return;
		}
		// Disabled resize
		watchResize();
		if (autoHeight) {
			setAutoHeight();
		}
		setBackgroundWrapper();

		mounted = true;
	});

	function setBackgroundWrapper() {
		const preBackground = window.getComputedStyle(preElement).backgroundColor;
		outerElement.style.backgroundColor = preBackground;
	}

	function setSizes() {
		const { height, width } = getTextareaSize();
		if (preElement) {
			preElement.style.width = `${width}px`;
			preElement.style.height = `${height}px`;
		}
		if (wrapperElement) {
			wrapperElement.style.width = `${width}px`;
			wrapperElement.style.height = `${height}px`;
		}
		const rem = parseFloat(window.getComputedStyle(document.documentElement).fontSize);

		if (outerElement) {
			outerElement.style.width = `${width + rem}px`;
			outerElement.style.height = `${height + rem}px`;
		}
	}

	function getTextareaSize() {
		if (textAreaElement == null) return { height: 0, width: 0 };
		const { height, width } = textAreaElement.getBoundingClientRect();
		return { height, width };
	}

	function setAutoHeight() {
		if (manualResize === true) {
			return;
		}
		wrapperElement.style.height = `0px`;
		wrapperElement.style.height = textAreaElement.scrollHeight + 'px';
	}

	function watchResize() {
		if (textAreaElement) new ResizeObserver(setSizes).observe(textAreaElement);
	}

	function syncScroll() {
		preElement.scrollTop = textAreaElement.scrollTop;
		preElement.scrollLeft = textAreaElement.scrollLeft;
		// Prevents a scrolling issue when the user manually resizes the wrapper
		if (textAreaElement.scrollTop > preElement.scrollTop) {
			textAreaElement.scrollTop = preElement.scrollTop;
		}
		if (textAreaElement.scrollLeft > preElement.scrollLeft) {
			textAreaElement.scrollLeft = preElement.scrollLeft;
		}
	}

	function handleKeyDown(event: KeyboardEvent) {
		let input_element = textAreaElement;
		let code = input_element.value;
		if (event.key === 'Tab') {
			// handleTabKey(event, input_element, code);
			onChange(input_element.value);
		}
		if (event.key === 'Enter') {
			// handleEnterKey(event, input_element);
			onChange(input_element.value);
		}
	}

	async function handleInput(e: Event) {
		// console.log('handleInput', e.target.value);
		onChange((e.target as HTMLTextAreaElement).value);
	}

	function handleMouseDown() {
		const { height, width } = getTextareaSize();
		wrapperHeight = height;
		wrapperWidth = width;
	}

	function handleMouseUp() {
		const { height, width } = getTextareaSize();
		if (height !== wrapperHeight || width !== wrapperWidth) {
			if (resize && resize !== 'auto') manualResize = true;
		}
	}

	$effect(() => {
		if (mounted === true) {
			try {
				if (highlightjs != null) {
					const tokens = highlightjs.highlight(value, {
						language: language
					}).value;
					if (autoHeight) {
						setAutoHeight();
					}
					codeTokens = tokens;
				}
			} catch (e) {
				console.error(e);
			}
		}
	});
</script>

<div bind:this={outerElement} style={`box-sizing: border-box;`} class="outer-wrapper">
	<div
		role="none"
		onmousedown={handleMouseDown}
		onmouseup={handleMouseUp}
		bind:this={wrapperElement}
		class={'wrap'}
	>
		<textarea
			class={`editable resize-${resize || 'auto'}`}
			spellcheck={false}
			onkeydown={handleKeyDown}
			oninput={handleInput}
			onscroll={syncScroll}
			bind:this={textAreaElement}
			placeholder={placeholder !== null ? placeholder : 'Type code here...'}
			bind:value
		></textarea>
		<!-- Keep this as a single line to preserve whitespace -->
		<pre bind:this={preElement} class={`language-${language}`} aria-hidden={true}><div
				class="code-highlighted">{@html codeTokens}</div></pre>
	</div>
</div>

<style>
	/* Original CSS written by Oliver Geer (WebCoder49) */
	/* https://css-tricks.com/creating-an-editable-textarea-that-supports-syntax-highlighted-code/ */
	/* Updated for svelte-code-input */

	.outer-wrapper * {
		box-sizing: border-box;
	}

	.wrap {
		position: relative;
		display: block;
		box-sizing: border-box;
		position: relative;
		top: 0;
		left: 0;
		display: block;
		overflow: hidden;
		font-size: 16px;
		font-family: monospace;
		line-height: normal;
		tab-size: 2;
		caret-color: darkgrey;
		white-space: pre;
	}

	.wrap textarea,
	.wrap pre {
		width: 100%;
		height: 100%;
		border: none;
		overflow: auto;
		outline: none;
		position: absolute;
		top: 0;
		left: 0;
		font-family: monospace;
		font-size: inherit !important;
		line-height: inherit !important;
		/* background: transparent; */
		padding: 0 !important;
		margin: 0 !important;
	}

	.wrap textarea,
	.wrap pre,
	.wrap pre * {
		font-size: inherit !important;
		font-family: inherit !important;
		line-height: inherit !important;
		tab-size: inherit !important;
	}

	.wrap textarea {
		display: block;
		color: transparent;
		background: transparent;
		caret-color: inherit !important;
		z-index: 1;
	}

	.wrap pre::-webkit-scrollbar {
		width: 0;
		height: 0;
	}

	.wrap pre {
		z-index: 0;
	}

	.wrap textarea,
	.wrap pre {
		overflow: auto !important;
		white-space: inherit;
		word-spacing: normal;
		word-break: normal;
		word-wrap: normal;
	}

	.wrap textarea.resize-both {
		resize: both;
	}

	.wrap textarea.resize-none {
		resize: none;
	}

	.wrap textarea.resize-auto {
		resize: none;
	}

	.wrap textarea.resize-horizontal {
		resize: horizontal;
	}

	.wrap textarea.resize-vertical {
		resize: vertical;
	}
</style>
