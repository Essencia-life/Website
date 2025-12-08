import type { Picture } from 'vite-imagetools';

const pageRegExp = new RegExp('/src/lib/assets/(?<file>media/.+)');
const mediaFiles = new Map(
	Object.entries(
		import.meta.glob<{ default: Picture }>('$lib/assets/media/**/*', {
			eager: true,
			query: { enhanced: true }
		})
	).map(([path, module]) => [path.match(pageRegExp)?.groups?.file, module.default])
);

export class Media {
	public static getFile(file: string) {
		const mediaFile = mediaFiles.get(file) ?? mediaFiles.get(file.substring(1));

		if (mediaFile) {
			return mediaFile;
		} else {
			throw new MediaFileNotFound(file);
		}
	}
}

export class MediaFileNotFound extends Error {
	constructor(file: string) {
		super(`Media ${file} not found`);
	}
}
