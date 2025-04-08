import type { IExoModule } from '@exomatique_editor/base';
import MdBlock from './MdBlock.svelte';
import type { MdData } from './MdData.js';

export default class MdModule implements IExoModule<MdData> {
	type = 'md';
	container = false;
	component = MdBlock;
	name = 'Markdown';
	icon = '<i class="fa-solid fa-m"></i>';
	default_value = () => '';
}
