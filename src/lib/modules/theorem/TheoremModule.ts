import SemanticModule from '../semantic/SemanticModule.js';
import TheoremBlock from './TheoremBlock.svelte';

export default class TheoremModule extends SemanticModule {
	component = TheoremBlock;
	constructor() {
		super('theorem', 'Theorem');
	}
}
