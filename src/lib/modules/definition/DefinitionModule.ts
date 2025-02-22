import SemanticModule from '../semantic/SemanticModule.js';
import DefinitionBlock from './DefinitionBlock.svelte';

export default class DefinitionModule extends SemanticModule {
	component = DefinitionBlock;
	constructor() {
		super('definition', 'Definition');
	}
}
