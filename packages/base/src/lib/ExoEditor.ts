import type IExoModule from './IExoModule.js';
import type IExoModuleData from './IExoModuleData.js';

export interface ExoEditorData {
	modules: IExoModule<any>[];
	default_module: string;
}

export default class ExoEditor {
	modules: { [id: string]: IExoModule<any> };
	default_module: IExoModule<any>;
	scoped_context = new Map<string, any>();
	global_context: any = {};

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

	addContext(key: string, value: any, scope?: IExoModule<any>) {
		if (scope) {
			const obj = this.scoped_context.get(scope.type) || {};
			obj[key] = value;
			this.scoped_context.set(scope.type, obj);
		} else {
			(this.global_context as any)[key] = value;
		}
	}

	getContext(key: string, scope?: IExoModule<any>) {
		if (scope) {
			const obj = this.scoped_context.get(scope.type) || {};

			if (Object.keys(obj).includes(key)) return obj[key];
		}
		if (Object.keys(this.global_context).includes(key)) return this.global_context[key];
		return undefined;
	}

	getContextFail(key: string, scope?: IExoModule<any>) {
		if (scope) {
			const obj = this.scoped_context.get(scope.type) || {};

			if (Object.keys(obj).includes(key)) return obj[key];
		}
		if (Object.keys(this.global_context).includes(key)) return this.global_context[key];
		throw new Error('Missing context key :' + key);
	}
}
