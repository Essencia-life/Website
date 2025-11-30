import { fromMarkdown } from 'mdast-util-from-markdown';
import { frontmatter } from 'micromark-extension-frontmatter';
import { frontmatterFromMarkdown } from 'mdast-util-frontmatter';
import * as yaml from 'yaml';

const pageRegExp = new RegExp('/src/lib/content/pages/(?<page>([a-z0-9-]+/)?[a-z0-9-]+).md');
const pages = new Map(
	Object.entries(
		import.meta.glob<{ default: string }>('$lib/content/pages/**/*.md', {
			eager: true,
			query: { raw: '' }
		})
	).map(([path, module]) => [path.match(pageRegExp)?.groups?.page, module.default])
);

export class Pages {
	public static getPage(url: string) {
		const content = pages.get(url);

		if (content) {
			const contentModel = fromMarkdown(content, {
				extensions: [frontmatter(['yaml'])],
				mdastExtensions: [frontmatterFromMarkdown(['yaml'])]
			});
			const { title } =
				yaml.parse(contentModel.children.find((it) => it.type === 'yaml')?.value ?? '') ?? {};

			console.log(title);

			return {
				title,
				content
			};
		} else {
			throw new PageNotFound(url);
		}
	}
}

export class PageNotFound extends Error {
	constructor(url: string) {
		super(`Page ${url} not found`);
	}
}
