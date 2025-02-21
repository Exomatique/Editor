import type ExoEditor from './ExoEditor.js';
import type IExoModuleData from './IExoModuleData.js';

export default abstract class ExoInstance {
	abstract getEditor: () => ExoEditor;
	abstract getBlocks: () => IExoModuleData[];
	abstract setBlocks: (blocks: IExoModuleData[]) => void;
	abstract getFocus: () => number;
	abstract setFocus: (v: number) => void;

	insertBlockAt: (block: IExoModuleData, index: number, focus?: boolean) => void = (
		block,
		index,
		focus
	) => {
		this.setBlocks(this.getBlocks().toSpliced(index, 0, block));
		if (focus === true) {
			this.setFocus(index);
		}
	};

	removeBlockAt: (index: number) => void = (index) => {
		const old_focus = this.getFocus();

		if (old_focus >= index) this.setFocus(old_focus - 1);
		this.setBlocks(this.getBlocks().filter((v, i) => i !== index));
	};
}
