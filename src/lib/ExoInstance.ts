import type ExoEditor from './ExoEditor.js';
import type IExoModule from './IExoModule.js';
import type IExoModuleData from './IExoModuleData.js';

type ToEditionType = 'NavigationUp' | 'NavigationDown' | 'Click';

export default abstract class ExoInstance {
	toEditionType: ToEditionType = 'Click';

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

	moveUp(index: number) {
		if (index <= 0) return;
		const save_edit = this.getEdition();
		let blocks = this.getBlocks();

		let previous = blocks[index - 1];
		let current = blocks[index];

		this.setBlocks(
			blocks.map((v, i) => {
				if (i === index) return previous;
				if (i === index - 1) return current;
				return v;
			})
		);

		this.setFocus(index - 1);
		if (save_edit === index) {
			this.setToEditionType('NavigationUp');
			this.setEdition(index - 1);
		}
	}

	delete(index: number) {
		let moveAfterDeletion = this.getEdition() === index;
		let blocks = this.getBlocks();

		this.setBlocks(blocks.filter((_, i) => i != index));
		if (index === blocks.length - 1) this.setFocus(index - 1);
		if (blocks.length === 1) {
			this.setFocus(-1);
			this.setEdition(-1);
			this.setHovered(-1);

			// ExoEditor will create a new value so focus and edit next "tick"
			setTimeout(() => {
				this.setFocus(0);
				this.setEdition(0);
			});
		}

		if (moveAfterDeletion && index != 0) {
			this.setToEditionType('NavigationUp');
			this.setFocus(index - 1);
			this.setEdition(index - 1);
		} else {
			this.setToEditionType('NavigationDown');
			this.setFocus(0);
			this.setEdition(0);
		}
	}

	moveDown(index: number) {
		if (index >= this.getBlocks().length - 1) return;
		let blocks = this.getBlocks();

		let next = blocks[index + 1];
		let current = blocks[index];

		this.setBlocks(
			blocks.map((v, i) => {
				if (i === index) return next;
				if (i === index + 1) return current;
				return v;
			})
		);

		const edition = this.getEdition();
		this.setFocus(-1);
		this.setHovered(-1);
		setTimeout(() => {
			this.setFocus(index + 1);
			if (edition === index) {
				this.setToEditionType('NavigationDown');
				this.setEdition(index + 1);
			}
		});
	}

	getToEditionType() {
		return this.toEditionType;
	}

	setToEditionType(v: ToEditionType) {
		this.toEditionType = v;
	}
}
