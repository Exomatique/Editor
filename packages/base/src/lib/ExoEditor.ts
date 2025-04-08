import type IExoModule from './IExoModule.js';
import type IExoModuleData from './IExoModuleData.js';

export interface ExoEditorData {
	modules: IExoModule<any>[];
	default_module: string;
}

export default class ExoEditor {
	modules: { [id: string]: IExoModule<any> };
	default_module: IExoModule<any>;
	constructor({ modules: modules, default_module: default_module }: ExoEditorData) {
		this.modules = {};
		modules.forEach((v) => (this.modules[v.type] = v));
		this.default_module = this.modules[default_module];
	}

	buildBlock(module: IExoModule<any>, data?: any): IExoModuleData {
		return {
			type: module.type,
			data: data || module.default_value(this),
			id: crypto.randomUUID().replaceAll('-', '_')
		};
	}
}
