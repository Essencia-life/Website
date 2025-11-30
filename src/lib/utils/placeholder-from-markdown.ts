import type { Extension as MdastExtension, Token } from 'mdast-util-from-markdown';

export function placeholderFromMarkdown(): MdastExtension {
	return {
		enter: {
			placeholder(token: Token) {
				this.enter({ type: 'placeholder', value: '' }, token);
			}
		},
		exit: {
			placeholder(token: Token) {
				const node = this.stack[this.stack.length - 1] as any;
				const raw = this.sliceSerialize(token);
				node.value = raw.slice(2, -2);
				this.exit(token);
			}
		}
	};
}
