import type IExoModule from '../../IExoModule.js';
import TextBlock from './TextBlock.svelte';
import type { TextData } from './TextData.js';

export default class TextModule implements IExoModule<any, TextData> {
	type = 'text';
	component = TextBlock;
	name = 'Text';
	icon = '<i class="fa-solid fa-t"></i>';
	default_value = () => '';
}
