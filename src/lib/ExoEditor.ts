import type IExoModule from './IExoModule.js';

export interface ExoEditorData {
	modules: IExoModule<any, any>[];
}

export default class ExoEditor {
	modules: { [id: string]: IExoModule<any, any> };
	constructor({ modules: modules }: ExoEditorData) {
		this.modules = {};
		modules.forEach((v) => (this.modules[v.type] = v));
	}
}
