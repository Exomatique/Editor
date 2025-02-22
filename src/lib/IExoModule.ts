import type { Component } from 'svelte';

export default interface IExoModule<U> {
	type: string;
	container: boolean;
	component: Component<any>;
	name: string;
	icon: string;

	default_value: () => U;
}
