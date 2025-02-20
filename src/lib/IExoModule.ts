import type { Component, ComponentType } from 'svelte';

export default interface IExoModule<T extends ComponentType, U extends any> {
	type: string;
	component: any;
}
