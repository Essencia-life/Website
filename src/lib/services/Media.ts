import type { Picture } from 'vite-imagetools';
import { getContext } from 'svelte';
import type { ApiAsset } from '@sveltia/cms';

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
		const getCmsAsset = getContext<((path: string) => ApiAsset | undefined) | undefined>('CmsAssetApi');
		const cmsAsset = getCmsAsset?.(file);
		const cmsAssetUrl = cmsAsset?.url;

		console.log({ file, cmsAsset, cmsAssetUrl, mediaFile });

		function buildImg(src: string) {
			const img = new Image();
			img.src = src;
			return {
				img: {
					src: img.src,
					get w() { return img.naturalWidth },
					get h() { return img.naturalHeight }
				}
			};
		}

		if (cmsAssetUrl) {
			return buildImg(cmsAssetUrl);
		} else if (mediaFile) {
			return mediaFile;
		} else if (location.hostname === 'localhost' && file.startsWith('blob:')) {
			return buildImg(file);
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
