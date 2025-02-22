import type { Component } from 'svelte';
import type ExoEditor from './ExoEditor';

export default interface IExoModule<U> {
	type: string;
	container: boolean;
	component: Component<any>;
	name: string;
	icon: string;

	default_value: (editor: ExoEditor) => U;
}
