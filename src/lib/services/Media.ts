import type { Picture } from 'vite-imagetools';
import { getContext } from 'svelte';

const pageRegExp = new RegExp('/src/lib/assets/(?<file>media/.+)');
const mediaFiles = new Map(
	Object.entries(
		import.meta.glob<{ default: Picture }>('$lib/assets/media/**/*', {
			eager: true,
			query: {
				as: 'run',
			}
		})
	).map(([path, module]) => [path.match(pageRegExp)?.groups?.file, module.default])
);

export class Media {
	public static getFile(file: string) {
		const mediaFile = mediaFiles.get(file) ?? mediaFiles.get(file.substring(1));
		const isCmsPreview = getContext<boolean>('CmsPreview');

		if (mediaFile) {
			return mediaFile;
		} else if (isCmsPreview) {
			const img = new Image();
			img.src = file;
			return {
				img: {
					src: img.src,
					get w() { return img.naturalWidth },
					get h() { return img.naturalHeight }
				}
			};
		} else {
			// console.log(mediaFiles.keys());
			throw new MediaFileNotFound(file);
		}
	}
}

export class MediaFileNotFound extends Error {
	constructor(file: string) {
		super(`Media ${file} not found`);
	}
}
