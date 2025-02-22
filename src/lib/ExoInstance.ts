import type ExoEditor from './ExoEditor.js';
import type IExoModule from './IExoModule.js';
import type IExoModuleData from './IExoModuleData.js';

export default abstract class ExoInstance {
	abstract getEditor: () => ExoEditor;
	abstract getBlocks: () => IExoModuleData[];
	abstract setBlocks: (blocks: IExoModuleData[]) => void;
	abstract getFocus: () => number;
	abstract setFocus: (v: number) => void;
	abstract getEdition: () => number;
	abstract setEdition: (v: number) => void;
	abstract getHovered: () => number;
	abstract setHovered: (v: number) => void;

	insertAndBuildBlockAt(
		module: IExoModule<any> | string,
		data: IExoModuleData | undefined,
		index: number
	) {
		const editor = this.getEditor();
		let real_module;
		if (typeof module === 'string') real_module = editor.modules[module];
		else real_module = module;
		const block = editor.buildBlock(real_module as IExoModule<any>, data);
		this.insertBlockAt(block, index);
	}

	insertBlockAt: (block: IExoModuleData, index: number, focus?: boolean) => void = (
		block,
		index
	) => {
		this.setBlocks(this.getBlocks().toSpliced(index, 0, block));
	};

	removeBlockAt: (index: number) => void = (index) => {
		const old_focus = this.getFocus();

		if (old_focus >= index) this.setFocus(old_focus - 1);
		this.setBlocks(this.getBlocks().filter((v, i) => i !== index));
	};
}
