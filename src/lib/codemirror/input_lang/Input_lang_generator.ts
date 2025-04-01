import { htmlLanguage } from '@codemirror/lang-html';
import { markdown } from '@codemirror/lang-markdown';
import {
	foldNodeProp,
	foldInside,
	indentNodeProp,
	Language,
	LRLanguage,
	LanguageSupport,
	HighlightStyle
} from '@codemirror/language';
import { parser } from './input_lang_parser';
import { parseMixed } from '@lezer/common';
import { styleTags, tags as t, Tag } from '@lezer/highlight';

const invisibleTag = Tag.define();

export const generateInputLang = (lang: Language, edit?: boolean) =>
	new LanguageSupport(
		LRLanguage.define({
			parser: parser.configure({
				props: [
					edit
						? styleTags({
								CONTENT_BEGIN: t.keyword,
								CONTENT_CLOSE: t.keyword,
								WRITE_OPEN: t.keyword,
								WRITE_CLOSE: t.keyword
							})
						: styleTags({
								CONTENT_BEGIN: invisibleTag,
								CONTENT_CLOSE: invisibleTag,
								WRITE_OPEN: invisibleTag,
								WRITE_CLOSE: invisibleTag
							})
				],

				wrap: parseMixed((node) => {
					return node.name === 'CONTENT' ? { parser: lang.parser } : null;
				})
			})
		})
	);

export const inputHighlighter = HighlightStyle.define([
	{
		tag: invisibleTag,
		class: 'hidden'
	}
]);

// export default generateInputLanguage({})

// const twigLanguage = LRLanguage.define({ parser: mixedTwigParser });
