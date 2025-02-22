import type ExoEditor from '../../ExoEditor.js';
import type IExoModule from '../../IExoModule.js';
import TextBlock from './TextBlock.svelte';
import type { TextData } from './TextData.js';

export default class TextModule implements IExoModule<TextData> {
	type = 'text';
	container = false;
	component = TextBlock;
	name = 'Text';
	icon = '<i class="fa-solid fa-t"></i>';
	default_value = (editor: ExoEditor) => '';
}
