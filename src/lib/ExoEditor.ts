import type IExoModule from './IExoModule.js';
import type IExoModuleData from './IExoModuleData.js';

export interface ExoEditorData {
	modules: IExoModule<any>[];
	default_module: string;
}

export default class ExoEditor {
	modules: { [id: string]: IExoModule<any> };
	default_module: string;
	constructor({ modules: modules, default_module: default_module }: ExoEditorData) {
		this.modules = {};
		this.default_module = default_module;
		modules.forEach((v) => (this.modules[v.type] = v));
	}

	buildBlock(module: IExoModule<any>, data?: any): IExoModuleData {
		return {
			type: module.type,
			data: data || module.default_value(this),
			id: crypto.randomUUID().replace('-', '_')
		};
	}
}
