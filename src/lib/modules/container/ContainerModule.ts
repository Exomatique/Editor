import type ExoEditor from '../../ExoEditor';
import type IExoModule from '../../IExoModule';
import Container from './Container.svelte';
import type { ContainerData } from './ContainerData';

export default class ContainerModule implements IExoModule<ContainerData> {
	type = 'container';
	container = true;
	component = Container;
	name = 'Container';
	icon = '<i class="fa-solid fa-c"></i>';
	default_value = (editor: ExoEditor) => [editor.buildBlock(editor.default_module)];
}
