import type { Component } from 'svelte';
import type ExoEditor from '../../ExoEditor.js';
import type IExoModule from '../../IExoModule.js';
import type IExoModuleData from '../../IExoModuleData.js';
import SemanticBlock from './SemanticBlock.svelte';
import type { Macro } from '../../IExoModule.js';

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

export function buildVariant(v: SemanticVariant): SemanticData {
	function fieldToValue<T>(field: SemanticField<T> | undefined, default_value: T): T | undefined {
		if (!field) return undefined;
		switch (field.type) {
			case 'none':
				return undefined;
			case 'static':
				return field.value;
			case 'editable':
				return field.value || default_value;
		}
	}

	return {
		prefix: fieldToValue(v.prefix, ''),
		title: fieldToValue(v.title, ''),
		baseColor: fieldToValue(v.baseColor, ''),
		spoiler: fieldToValue(v.spoiler, false),
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
			value_creator: () => buildVariant(v)
		}));
	}

	default_value = () => {
		return buildVariant(this.variants[0]);
	};
}
