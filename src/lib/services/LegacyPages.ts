import type { Metadata } from '../../routes/+layout.server';

const pageRegExp = /\/src\/routes\/\(pages\)(?<path>\/[a-z0-9-/]+)\/\+page.md/;
const pages = new Map(
	Object.entries(import.meta.glob<{ metadata: Metadata }>('/src/**/+page.md', { eager: true })).map(
		([path, module]) => [path.match(pageRegExp)?.groups?.path, module.metadata]
	)
);

export class LegacyPages {
	public static getPageMetadata(url: string) {
		return pages.get(url);
	}
}
