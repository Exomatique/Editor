import type { Component } from 'svelte';
import SemanticModule from '../semantic/SemanticModule.js';
import CorrectionBlock from './CorrectionBlock.svelte';

export default class CorrectionModule extends SemanticModule {
	component = CorrectionBlock;
	constructor() {
		super('correction', 'Correction');
	}
}
