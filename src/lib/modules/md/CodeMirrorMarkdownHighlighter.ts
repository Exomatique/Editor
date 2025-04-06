import { visit } from 'unist-util-visit';
import { EditorView } from '@codemirror/view';
import { EditorState } from '@codemirror/state';
import { getLanguage } from '../code/LanguageSupport'; // your helper!
import { syntaxHighlighting, HighlightStyle, defaultHighlightStyle } from '@codemirror/language';

// Optional: escape HTML
const escapeHtml = (str: string) =>
	str
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&#039;');

export default function rehypeCodeMirrorHighlight() {
	return async function transformer(tree: any) {
		const promises: Promise<void>[] = [];

		visit(tree, 'element', (node, _index, parent) => {
			if (node.tagName === 'pre' && node.children?.[0]?.tagName === 'code') {
				const codeNode = node.children[0];
				const className = codeNode.properties?.className?.[0] || '';
				const langMatch = className.match(/language-(\w+)/);
				const lang = langMatch?.[1];

				const code = codeNode.children[0]?.value?.trim() || '';

				const langSupport = lang ? getLanguage(lang) : null;

				if (langSupport) {
					promises.push(
						new Promise(async (resolve) => {
							const lang = await langSupport.load();
							const state = EditorState.create({
								doc: code,
								extensions: [
									lang,
									EditorView.editable.of(false),
									EditorView.lineWrapping,
									syntaxHighlighting(defaultHighlightStyle)
								]
							});

							const view = new EditorView({ state });

							// Replace node with a <div> containing the CodeMirror DOM
							node.tagName = 'div';
							node.properties = {
								className: ['codemirror-preview']
							};
							node.children = [
								{
									type: 'raw',
									value: view.dom.outerHTML
								}
							];

							// Clean up
							view.destroy();
							resolve();
						})
					);
				}
			}
		});

		await Promise.all(promises);
	};
}
