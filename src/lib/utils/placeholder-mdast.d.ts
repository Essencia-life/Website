import 'mdast';

declare module 'mdast' {
	interface Placeholder extends Literal {
		type: 'placeholder';
	}

	interface RootContentMap {
		placeholder: Placeholder;
	}
}
