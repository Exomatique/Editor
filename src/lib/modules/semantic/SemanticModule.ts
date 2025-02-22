import type { Component } from 'svelte';
import type IExoModule from '../../IExoModule.js';
import SemanticBlock from './SemanticBlock.svelte';
import type SemanticData from './SemanticData.js';

export default abstract class SemanticModule implements IExoModule<SemanticData> {
	container = true;

	type: string;
	name: string;
	icon: string;
	constructor(type: string, name: string) {
		this.type = type;
		this.name = name;
		this.icon = '<i class="fa-solid fa-' + this.type.charAt(0) + '"></i>';
	}
	abstract component: Component<any, {}, string>;

	default_value = () => {
		return { title: '', blocks: [] };
	};
}
