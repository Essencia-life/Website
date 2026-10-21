import type { Field } from '@sveltia/cms';

/**
 * Maps Sveltia CMS field widget types to TypeScript types
 */
type WidgetTypeMap = {
	string: string;
	text: string;
	textarea: string;
	markdown: string;
	richtext: string;
	number: number;
	boolean: boolean;
	date: string;
	datetime: string;
	time: string;
	select: string;
	relation: string | Record<string, any>;
	list: any[];
	object: Record<string, any>;
	hidden: string;
	image: string;
	file: string;
};

/**
 * Infer the TypeScript type from a single Sveltia CMS field
 */
export type InferFieldType<F> = F extends {
	name?: any;
	widget: infer W;
	fields?: infer Fields;
	types?: infer Types;
	required?: infer R;
}
	? W extends 'list'
		? Types extends readonly any[]
			? InferListTypes<Types>[]
			: Fields extends readonly any[]
				? InferFieldsObject<Fields>[]
				: any[]
		: W extends 'object'
			? Fields extends readonly any[]
				? InferFieldsObject<Fields> | (R extends false ? undefined : never)
				: Record<string, any>
			: W extends keyof WidgetTypeMap
				? WidgetTypeMap[W] | (R extends false ? undefined : never)
				: string | (R extends false ? undefined : never)
	: string;

/**
 * Helper: Extract a specific field from array by name
 */
type ExtractFieldByName<
	Fields extends readonly any[],
	Name extends string
> = Fields extends readonly [infer Head, ...infer Tail]
	? Head extends { name: Name }
		? Head
		: ExtractFieldByName<Tail, Name>
	: never;

/**
 * Helper: Extract all field names from an array
 */
type FieldNames<Fields extends readonly any[]> = Fields extends readonly (infer F)[]
	? F extends { name: infer N }
		? N
		: never
	: never;

/**
 * Convert an array of Field definitions into an object type
 * with keys matching field names and values matching inferred types
 * Optional properties are marked with ? if required: false
 */
export type InferFieldsObject<Fields extends readonly any[]> = {
	[K in FieldNames<Fields> as ExtractFieldByName<Fields, K & string> extends { required: false }
		? never
		: K]: ExtractFieldByName<Fields, K & string> extends infer F ? InferFieldType<F> : never;
} & {
	[K in FieldNames<Fields> as ExtractFieldByName<Fields, K & string> extends { required: false }
		? K
		: never]?: ExtractFieldByName<Fields, K & string> extends infer F
		? Exclude<InferFieldType<F>, undefined>
		: never;
};

/**
 * Main type inference function for a CollectionFile's fields
 * Usage: type HeaderType = InferCollectionType<typeof headerCmsConfig>;
 */
export type InferCollectionType<Config> = Config extends { fields: infer F }
	? F extends Field[]
		? InferFieldsObject<F>
		: never
	: never;

/**
 * Helper: Filter out hidden 'type' fields from array
 */
type FilterTypeField<Fields extends readonly any[]> = Fields extends readonly [
	infer Head,
	...infer Tail
]
	? Head extends { name: 'type'; widget: 'hidden' }
		? FilterTypeField<Tail>
		: readonly [Head, ...FilterTypeField<Tail>]
	: readonly [];

/**
 * Helper: Extract the type value from hidden 'type' field's default property
 */
type ExtractTypeValue<Fields extends readonly any[]> = Fields extends readonly [
	infer Head,
	...infer Tail
]
	? Head extends { name: 'type'; widget: 'hidden'; default: infer D }
		? D
		: ExtractTypeValue<Tail>
	: never;

/**
 * Helper: Infer union type from list widget with types
 * Creates a Discriminated Union using the hidden 'type' field's default value
 * Automatically filters out the hidden 'type' field from the inferred object
 */
export type InferListTypes<Types extends readonly any[]> = Types extends readonly (infer Type)[]
	? Type extends { name?: any; widget: 'object'; fields?: infer Fields }
		? Fields extends readonly any[]
			? InferFieldsObject<FilterTypeField<Fields>> & { type: ExtractTypeValue<Fields> }
			: never
		: never
	: never;

/**
 * Helper: Infer type from a Field array directly
 * Useful for: InferFieldsObject<typeof myField.fields>
 */
export type InferFromFields<F extends readonly any[]> = {
	[K in F extends readonly (infer Field)[]
		? Field extends { name: infer N }
			? N
			: never
		: never as K]: F extends readonly (infer Field)[]
		? Field extends { name: K }
			? InferFieldType<Field>
			: never
		: never;
};

/**
 * Alternative: Use this if your Field arrays aren't strictly typed
 * This version is more lenient with type inference
 */
export type InferFieldsObjectLenient<Fields extends readonly any[] = readonly Field[]> = {
	[K in Fields extends readonly (infer F)[]
		? F extends { name: infer N }
			? N
			: never
		: never]: Fields extends readonly (infer F)[]
		? F extends { name: infer N; widget: infer W }
			? W extends 'list' | 'object'
				? F extends { fields: infer SubFields }
					? SubFields extends Field[]
						? InferFieldsObjectLenient<SubFields> | InferFieldsObjectLenient<SubFields>[]
						: any
					: any
				: W extends keyof WidgetTypeMap
					? WidgetTypeMap[W]
					: string
			: string
		: never;
};
