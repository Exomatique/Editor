import type { Component } from 'svelte';
import type ExoEditor from './ExoEditor.js';

export interface Macro<U> {
	key: string;
	value_creator: (editor: ExoEditor) => U;
	icon: string;
}

export default interface IExoModule<U> {
	type: string;
	container: boolean;
	component: Component<any>;
	name?: string;
	icon: string;

	macros?: Macro<U>[];
	default_value: (editor: ExoEditor) => U;
}
