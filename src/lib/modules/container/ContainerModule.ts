import type { Component } from 'svelte';
import type IExoModule from '../../IExoModule';
import type { ContainerData } from './ContainerData';
import Container from './Container.svelte';
import type ExoEditor from '../../ExoEditor';

export default class ContainerModule implements IExoModule<ContainerData> {
	type = 'container';
	container = true;
	component = Container;
	name = 'Container';
	icon = '<i class="fa-solid fa-c"></i>';
	default_value = (editor: ExoEditor) => [editor.buildBlock(editor.modules[editor.default_module])];
}
