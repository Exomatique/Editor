import { languages as native_languages } from '@codemirror/language-data';

import {
	LanguageDescription,
	LanguageSupport,
	StreamLanguage,
	type StreamParser
} from '@codemirror/language';

export function legacy(parser: StreamParser<unknown>): LanguageSupport {
	return new LanguageSupport(StreamLanguage.define(parser));
}

let new_languages: LanguageDescription[] = [];

export function addSupport(lang: LanguageDescription) {
	new_languages.push(lang);
}

export function getSupportedLanguages() {
	return [...new_languages, ...native_languages];
}

export function getLanguage(nameOrAlias: string) {
	return getSupportedLanguages().find((description) => {
		return Array(...description.alias, description.name).find((v) =>
			v.toLowerCase().startsWith(nameOrAlias.toLowerCase())
		);
	});
}
