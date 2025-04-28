import type { IExoModule } from '@exomatique_editor/base';
import MdBlock from './MdBlock.svelte';
import type { MdData } from './MdData.js';

export interface MarkdownPlugin {
	type: 'rehype' | 'remark';
	plugin: any;
	parameter?: any[];
}

export default class MdModule implements IExoModule<MdData> {
	type = 'md';
	container = false;
	component = MdBlock;
	name = 'Markdown';
	icon = '<i class="fa-solid fa-m"></i>';
	default_value = () => '';

	extra_plugins: MarkdownPlugin[] = [];

	constructor(plugins?: MarkdownPlugin[]) {
		this.extra_plugins.concat(plugins || []);
	}

	addPlugin(plugin: MarkdownPlugin) {
		this.extra_plugins.push(plugin);
	}
}
