import type IExoModule from '../../IExoModule';
import CodeBlock from './CodeBlock.svelte';
import type { CodeData } from './CodeData';

export default class CodeModule implements IExoModule<CodeData> {
	type = 'code';
	container = false;
	component = CodeBlock;
	name = 'Code';
	icon = '<i class="fa-solid fa-c"></i>';
	default_value = () => ({ lang: 'python', content: '' });
}
