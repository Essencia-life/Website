import type { InferCollectionType } from '$lib/types/cms-types';
import { pageCollection } from '$lib/components/templates/Page.svelte';

const pageRegExp = new RegExp('/src/lib/content/pages/(?<path>.+)\.json');
const pages = new Map(
	Object.entries(
		import.meta.glob<{ default: InferCollectionType<typeof pageCollection> }>(
			'$lib/content/pages/**/*.json',
			{ eager: true }
		)
	).map(([path, module]) => [
		path.match(pageRegExp)!.groups!.path!.replaceAll('(root)/', ''),
		module.default
	])
);

export class Pages {
	static getAllPaths() {
		return Array.from(pages.keys(), (path) => ({ path })).filter(({ path }) => path !== '(root)');
	}

	public static getPage(path: string) {
		const page = pages.get(path) ?? pages.get(path.substring(1));

		if (page) {
			return page;
		} else {
			console.log(pages.keys());
			throw new PageCollectionNotFound(path);
		}
	}
}

export class PageCollectionNotFound extends Error {
	constructor(path: string) {
		super(`Page ${path} not found`);
	}
}
