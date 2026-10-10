import type { Plugin, ResolvedConfig, ViteDevServer } from 'vite';
import { build as viteBuild } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import tailwindcss from '@tailwindcss/vite';
import { compile, preprocess } from 'svelte/compiler';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import fs from 'node:fs/promises';
import path from 'node:path';

const CSS_ENTRY_PATH = 'src/routes/admin/preview-css.ts';
const CSS_ENTRY_URL = `/${CSS_ENTRY_PATH}`;
const OUTPUT_PATH = 'admin/preview.css';
const VIRTUAL_PREFIX = '/@preview-css';

const SKIP_PATTERNS = [
	/^\/@id\//,
	/^\0/,
	/^virtual:/,
	/\$app\//,
	/\$env\//,
	/\$service-worker/,
	/\?url$/,
	/\?raw$/,
	/\?worker/,
	/[*{}]/,
	/\/routes\/.*\+(page|layout|server)/
];

function shouldSkip(url: string): boolean {
	return SKIP_PATTERNS.some((pattern) => pattern.test(url));
}

function isRecursable(url: string): boolean {
	if (shouldSkip(url)) return false;
	if (url.includes('/node_modules/')) return false;
	if (!/^(\/@fs\/)?.*\/src\//.test(url) && !url.startsWith('/src/')) return false;
	return /\.(svelte|ts|js)(\?.*)?$/.test(url);
}

async function collectCssImports(
	server: ViteDevServer,
	url: string,
	visited = new Set<string>(),
	imports: string[] = []
): Promise<string[]> {
	if (visited.has(url) || shouldSkip(url)) return imports;
	visited.add(url);

	let mod;
	try {
		await server.transformRequest(url);
		mod = await server.moduleGraph.getModuleByUrl(url);
	} catch {
		return imports;
	}
	if (!mod) return imports;

	const isCss = url.endsWith('.css') && !url.includes('?svelte');
	const isSvelte = url.endsWith('.svelte');

	if (isSvelte) {
		imports.push(`${VIRTUAL_PREFIX}${url}.css?direct`);
	} else if (isCss) {
		imports.push(`${url}${url.includes('?') ? '&' : '?'}direct`);
		return imports;
	}

	for (const dep of mod.importedModules) {
		if (!dep.url || visited.has(dep.url)) continue;
		if (dep.url.includes('?svelte&type=style')) continue;

		const isCssDep = dep.url.endsWith('.css') && !dep.url.includes('?svelte');
		const isSvelteDep = dep.url.endsWith('.svelte');

		if (isCssDep || isSvelteDep || isRecursable(dep.url)) {
			await collectCssImports(server, dep.url, visited, imports);
		}
	}

	return imports;
}

async function extractComponentCss(config: ResolvedConfig, componentUrl: string): Promise<string> {
	const filePath = path.join(config.root, componentUrl);
	const source = await fs.readFile(filePath, 'utf-8');

	const { code } = await preprocess(source, vitePreprocess(), { filename: filePath });
	const { css } = compile(code, { filename: filePath, css: 'external' });

	return css?.code ?? '';
}

export function previewCss(): Plugin {
	let config: ResolvedConfig;

	return {
		name: 'preview-css',

		configResolved(c) {
			config = c;
		},

		resolveId(id) {
			const [bareId] = id.split('?');
			if (bareId.startsWith(VIRTUAL_PREFIX) && bareId.endsWith('.css')) {
				return id;
			}
		},

		async load(id) {
			const [bareId] = id.split('?');
			if (!bareId.startsWith(VIRTUAL_PREFIX) || !bareId.endsWith('.css')) return;

			const componentUrl = bareId.slice(VIRTUAL_PREFIX.length, -'.css'.length);
			try {
				return await extractComponentCss(config, componentUrl);
			} catch (e) {
				this.error(`preview-css: failed to compile ${componentUrl}: ${(e as Error).message}`);
			}
		},

		configureServer(server) {
			server.middlewares.use(async (req, res, next) => {
				if (req.url !== `/${OUTPUT_PATH}`) return next();

				try {
					const cssUrls = await collectCssImports(server, CSS_ENTRY_URL);
					const importStatements = cssUrls.map((url) => `@import url("${url}");`).join('\n');

					res.setHeader('Content-Type', 'text/css');
					res.end(importStatements);
				} catch (e) {
					next(e);
				}
			});
		},

		async closeBundle() {
			if (config.command !== 'build') return;
			if (process.env.__PREVIEW_CSS_BUILD) return;
			process.env.__PREVIEW_CSS_BUILD = '1';

			try {
				const adminDir = path.join(config.build.outDir, path.dirname(OUTPUT_PATH));
				await fs.rm(adminDir, { recursive: true, force: true });

				await viteBuild({
					configFile: false,
					logLevel: 'warn',
					root: config.root,
					resolve: {
						alias: config.resolve.alias
					},
					plugins: [
						tailwindcss(),
						svelte({
							compilerOptions: { css: 'external' }
						}),
						{
							name: 'merge-css',
							generateBundle(_, bundle) {
								const isCssAsset = (fileName: string, item: any): boolean => {
									if (item.type !== 'asset') return false;
									if (fileName.endsWith('.css')) return true;

									const names: string[] = [
										...(item.originalFileNames ?? []),
										...(item.originalFileName ? [item.originalFileName] : [])
									];
									return names.some((n: string) => n.endsWith('.css'));
								};

								const cssFileNames = Object.keys(bundle).filter((fileName) =>
									isCssAsset(fileName, bundle[fileName])
								);

								const cssChunks = cssFileNames.map((fileName) => {
									const item = bundle[fileName] as any;
									return typeof item.source === 'string'
										? item.source
										: Buffer.from(item.source).toString('utf-8');
								});

								for (const fileName of Object.keys(bundle)) {
									delete bundle[fileName];
								}

								if (cssChunks.length === 0) {
									this.warn('preview-css: keine CSS-Assets im Bundle gefunden');
									return;
								}

								this.emitFile({
									type: 'asset',
									fileName: OUTPUT_PATH,
									source: cssChunks.join('\n')
								});
							}
						}
					],
					build: {
						outDir: config.build.outDir,
						emptyOutDir: false,
						cssCodeSplit: true,
						write: true,
						manifest: false,
						ssrManifest: false,
						rollupOptions: {
							input: path.resolve(CSS_ENTRY_PATH),
							treeshake: false,
							output: {}
						}
					}
				});
			} catch (e) {
				console.error('[preview-css] inner build failed:', e);
				throw e;
			} finally {
				delete process.env.__PREVIEW_CSS_BUILD;
			}
		}
	};
}
