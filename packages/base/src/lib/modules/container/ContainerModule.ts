import type ExoEditor from '../../ExoEditor.js';
import type IExoModule from '../../IExoModule.js';
import Container from './Container.svelte';
import type { ContainerData } from './ContainerData.js';

export default class ContainerModule implements IExoModule<ContainerData> {
	type = 'container';
	container = true;
	component = Container;
	name = 'Container';
	icon = '<i class="fa-solid fa-c"></i>';
	default_value = (editor: ExoEditor) => [editor.buildBlock(editor.default_module)];
}
