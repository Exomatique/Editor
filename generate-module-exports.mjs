import fs from 'fs';
import path from 'path';

const baseDir = './src/lib/modules';

// Function to generate an index.ts file for each module
function generateModuleIndex(modulePath) {
	const files = fs
		.readdirSync(modulePath)
		.filter((file) => file.endsWith('.ts') || file.endsWith('.svelte'))
		.filter((file) => file !== 'index.ts')
		.filter(
			(file) =>
				file.endsWith('.svelte') || fs.readFileSync(modulePath + '/' + file).includes('\nexport')
		)
		.map((file) => {
			const extension_less = file.replace(/\.[tj]s|\.svelte$/, '');
			const export_all = `export * from './${extension_less}';`;
			if (file.endsWith('.svelte')) {
				return `export {default as ${extension_less}} from './${file}';`;
			}
			if (file.endsWith('Module.ts')) {
				return `export {default as ${extension_less}} from './${extension_less}';\n${export_all}`;
			}

			return export_all;
		});

	const indexPath = path.join(modulePath, 'index.ts');
	fs.writeFileSync(indexPath, files.join('\n'), 'utf8');
	console.log(`Generated: ${indexPath}`);
}

// Function to generate the main index.ts in the modules folder
function generateModulesIndex() {
	const modules = fs
		.readdirSync(baseDir)
		.filter((dir) => fs.statSync(path.join(baseDir, dir)).isDirectory());

	const exports = modules.map((module) => `export * as ${module} from './${module}';`);
	const indexPath = path.join(baseDir, 'index.ts');

	fs.writeFileSync(indexPath, exports.join('\n'), 'utf8');
	console.log(`Generated: ${indexPath}`);
}

// Process all modules
fs.readdirSync(baseDir)
	.filter((dir) => fs.statSync(path.join(baseDir, dir)).isDirectory())
	.forEach((dir) => generateModuleIndex(path.join(baseDir, dir)));

generateModulesIndex();
