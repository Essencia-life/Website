// placeholder-syntax.ts
import type { Extension, Tokenizer, State } from 'micromark-util-types';

export function placeholderSyntax(): Extension {
	return {
		text: {
			123: {
				name: 'placeholder',
				tokenize: tokenizePlaceholder
			}
		}
	};
}

const tokenizePlaceholder: Tokenizer = function (effects, ok, nok) {
	const buffer = '';

	const start: State = (code) => {
		if (code !== 123) return nok(code);
		effects.enter('placeholder');
		effects.consume(code);
		return openBrace;
	};

	const openBrace: State = (code) => {
		if (code === 123) {
			effects.consume(code);
			return inside;
		}
		return nok(code);
	};

	const inside: State = (code) => {
		if (code === null) return nok(code);

		if (code === 125) {
			return closeBrace1(code);
		}

		effects.consume(code);
		return inside;
	};

	const closeBrace1: State = (code) => {
		if (code !== 125) return nok(code);
		effects.consume(code);
		return closeBrace2;
	};

	const closeBrace2: State = (code) => {
		if (code !== 125) return nok(code);

		effects.consume(code);
		effects.exit('placeholder');
		return ok;
	};

	return start;
};
