import { LanguageDescription } from '@codemirror/language';
import { addSupport, type IExoModule, type Macro } from '@exomatique_editor/base';
import { dot } from '@viz-js/lang-dot';
import GraphBlock from './GraphBlockSvelte.svelte';

export interface GraphData {
	graphiz_script: string;
}

export default class GraphModule implements IExoModule<GraphData> {
	container = false;

	type = 'graph';
	name = 'Graph';
	icon = '<i class="fa-solid fa-g"></i>';
	component = GraphBlock;
	macros: Macro<GraphData>[] = [];

	constructor() {
		addSupport(
			LanguageDescription.of({
				name: 'dot',
				alias: ['graphviz'],
				load: async () => dot()
			})
		);
	}

	default_value = () => ({ graphiz_script: '' });
}
