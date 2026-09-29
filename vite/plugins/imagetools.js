import { imagetools, pictureFormat } from 'vite-imagetools';

function asURLSearchParams(value) {
	if (value instanceof URLSearchParams) return new URLSearchParams(value);
	if (typeof value === 'string') return new URLSearchParams(value);
	if (typeof value === 'number') return new URLSearchParams({ lqip: String(value) });
	if (value && typeof value === 'object') {
		return new URLSearchParams(
			Object.entries(value).flatMap(([key, current]) => {
				if (Array.isArray(current)) {
					return current.map((entry) => [key, String(entry)]);
				}
				return [[key, String(current)]];
			})
		);
	}
	return new URLSearchParams();
}

function run(cfg = new URLSearchParams()) {
	const directives = asURLSearchParams(cfg);

	return function outputFormat(args = []) {
		const lqip = Number.parseInt(
			directives.get('lqip') ?? args.find((value) => /^-?\d+$/.test(String(value))) ?? '16',
			10
		);

		return async function formatPicture(metadatas) {
			const pic = pictureFormat()(metadatas);
			if (!Number.isFinite(lqip) || lqip <= 0) return pic;

			const source = metadatas.find((entry) => entry.src === pic.img.src);
			if (!source?.image) return pic;

			if (lqip > 1) {
				const buffer = await source.image
					.clone()
					.resize({ width: lqip })
					.toFormat('webp', { quality: 20 })
					.toBuffer();
				pic.img.lqip = buffer.toString('base64');
				return pic;
			}

			const { dominant } = await source.image.stats();
			const { r, g, b } = dominant;
			pic.img.lqip = '#' + ((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1);
			return pic;
		};
	};
}

function main({
	profiles = {},
	defaultDirectives = new URLSearchParams(),
	exclude = '{build,dist,node_modules}/**/*',
	extendOutputFormats = (builtins) => builtins,
	...rest
} = {}) {
	const dict = {
		run: defaultDirectives,
		...profiles
	};

	return imagetools({
		defaultDirectives: (url) => {
			const as = url.searchParams.get('as');
			const key = as?.split(':')[0];
			if (key && Object.hasOwn(dict, key)) {
				return asURLSearchParams(dict[key]);
			}
			return asURLSearchParams(defaultDirectives);
		},
		extendOutputFormats: (builtins) => {
			const custom = Object.fromEntries(
				Object.entries(dict).map(([key, value]) => [key, run(value)])
			);
			return {
				...extendOutputFormats(builtins),
				...builtins,
				...custom
			};
		},
		exclude,
		...rest
	});
}

export { main as imagetools, run };