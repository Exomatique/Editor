import type { IExoModule, IExoModuleData, Macro } from '@exomatique_editor/base';
import SemanticBlock from './SemanticBlock.svelte';

export type SemanticField<T> =
	| { type: 'static'; value: T }
	| { type: 'editable'; value?: T }
	| { type: 'none' };

export interface SemanticVariant {
	name: string;
	prefix?: SemanticField<string>;
	title?: SemanticField<string>;
	baseColor?: SemanticField<string>;
	spoiler?: SemanticField<boolean>;
	icon?: string;
}

export function fieldToValue<T>(
	field: SemanticField<T> | undefined,
	default_value?: T,
	preventStaticSave?: boolean
): T | undefined {
	if (!field) return undefined;
	switch (field.type) {
		case 'none':
			return undefined;
		case 'static':
			return preventStaticSave ? undefined : field.value;
		case 'editable':
			return default_value || field.value;
	}
}

export function buildVariant(v: SemanticVariant): SemanticData {
	return {
		prefix: fieldToValue(v.prefix, undefined, true),
		title: fieldToValue(v.title, undefined, true),
		baseColor: fieldToValue(v.baseColor, undefined, true),
		spoiler: fieldToValue(v.spoiler, undefined, true),
		content: [],
		preset: v.name
	};
}

export interface SemanticData {
	prefix?: string;
	title?: string;
	baseColor?: string;
	spoiler?: boolean;
	content: IExoModuleData[];
	preset: string;
}

export default class SemanticModule implements IExoModule<SemanticData> {
	container = true;

	type = 'semantic';
	name = 'Semantic';
	icon = '<i class="fa-solid fa-s"></i>';
	variants: SemanticVariant[] = [];
	component = SemanticBlock;
	macros: Macro<SemanticData>[] = [];

	constructor(variants: SemanticVariant[] = []) {
		this.variants =
			variants.length === 0
				? [
						{
							name: 'editable',
							prefix: { type: 'editable', value: '' },
							title: { type: 'editable', value: '' },
							baseColor: { type: 'editable', value: '' },
							spoiler: { type: 'editable', value: false }
						}
					]
				: variants;

		this.macros = this.variants.map((v) => ({
			key: v.name,
			icon: v.icon || `<i class="fa-solid fa-${v.name.charAt(0).toLowerCase()}"></i>`,
			value_creator: () => ({ preset: v.name, content: [] })
		}));
	}

	default_value = () => {
		return { preset: this.variants[0].name, content: [] };
	};
}
